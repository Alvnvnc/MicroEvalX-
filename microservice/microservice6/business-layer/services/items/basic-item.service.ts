// items/basic-item.service.ts
import { Request } from 'express';
import { BaseService } from '../../common/base.service';
import { ItemCreateVM, ItemUpdateVM } from '../../../helpers/view-models/item.vm';
import {
  getAllAttributes,
  ItemCreateDTO,
  ItemResultDTO,
  removeAuditColumnsFromItem,
} from '../../../helpers/dto/item.dto';
import { ItemRepository } from '../../../data-access/repositories/item.repository';
import { ItemAttributes } from '../../../infrastructure/models/item.model';
import { CreationAttributes, Model, WhereOptions } from 'sequelize';
import { formatMessage, getMessage } from '../../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../../helpers/messages/messagesKey';
import { findCurrencyByCriteria, findTaxByID } from '../../../data-access/integrations/generalSystem.integration';
import { CodeGenerator } from '../../../helpers/utility/generateCode';
import { generateCSVItem } from '../../../helpers/utility/csv/generateCsvItem';
import { CategoryUnitService } from './category-unit.service';

export class BasicItemService extends BaseService<Model<ItemAttributes>> {
  private categoryUnitService: CategoryUnitService;

  constructor() {
    super(new ItemRepository());
    this.categoryUnitService = new CategoryUnitService();
  }

  //region Helper methods
  private async convertToResultDTO(model: Model<ItemAttributes>, includeCoa: boolean = true): Promise<ItemResultDTO> {
    const item = model.toJSON() as ItemAttributes;
    let currency;
    let tax;

    if (item.currency_code) {
      const response = await findCurrencyByCriteria({ code: item.currency_code });
      if (response.data?.data?.length > 0) {
        currency = response.data.data[0];
      }
    }

    if (item.tax_pkid) {
      const response = await findTaxByID(item.tax_pkid);
      if (response.data?.data) {
        tax = response.data.data;
      }
    }

    // Get and handle item category with null check
    let itemCategory = undefined;
    if (item.item_category_pkid) {
      const category = await this.categoryUnitService.findItemCategoryByID({} as Request, item.item_category_pkid);
      if (category) {
        itemCategory = category;
      }
    }
    
    // Get and handle unit with null check
    let unit = undefined;
    if (item.unit_pkid) {
      const unitResult = await this.categoryUnitService.findUnitByID({} as Request, item.unit_pkid);
      if (unitResult) {
        unit = unitResult;
      }
    }

    return getAllAttributes(item, currency, tax, itemCategory, unit);
  }
  //endregion

  //region Find methods
  async findAllItems(req: Request): Promise<ItemResultDTO[]> {
    const items = await super.findAll(req);
    return await Promise.all(items.map((item) => this.convertToResultDTO(item, false)));
  }

  async findItemByID(req: Request, pkid: number): Promise<ItemResultDTO | null> {
    const item = await super.findByPKID(req, pkid);
    if (item) {
      return await this.convertToResultDTO(item);
    }
    return null;
  }

  async findItemsByCriteria(req: Request, criteria: any): Promise<ItemResultDTO[]> {
    const where: WhereOptions<ItemAttributes> = {};
    if (criteria.code) where.code = criteria.code;
    if (criteria.name) where.name = criteria.name;

    const items = await this.where(req, where);
    return await Promise.all(items.map((item) => this.convertToResultDTO(item, false)));
  }
  //endregion

  //region Create methods
  async createItem(req: Request, vm: ItemCreateVM): Promise<ItemResultDTO> {
    const generatedCode = await CodeGenerator.generateItemCode(vm.itemData.item_category_pkid);

    const dto: ItemCreateDTO = {
      code: generatedCode,
      item_category_pkid: vm.itemData.item_category_pkid,
      unit_pkid: vm.itemData.unit_pkid,
      tax_pkid: vm.itemData.tax_pkid,
      currency_code: vm.itemData.currency_code,
      name: vm.itemData.name,
      purchase_price: vm.itemData.purchase_price,
      selling_price: vm.itemData.selling_price,
      description: vm.itemData.description,
      status: vm.itemData.status,
      sku: vm.itemData.sku,
      barcode: vm.itemData.barcode,
      weight: vm.itemData.weight,
      dimensions: vm.itemData.dimensions,
    };

    const createdItem = await this.repository.create(
      req,
      dto as unknown as CreationAttributes<Model<ItemAttributes>>,
    );

    if (!(createdItem instanceof Model)) {
      throw new Error(formatMessage(getMessage(req, MessagesKey.ERRORCREATION), ['item']));
    }

    return await this.convertToResultDTO(createdItem);
  }
  //endregion

  //region Update methods
  async updateItem(req: Request, pkid: number, vm: ItemUpdateVM): Promise<ItemResultDTO> {
    const allowedUpdates: Partial<ItemAttributes> = {
      item_category_pkid: vm.itemData.item_category_pkid,
      unit_pkid: vm.itemData.unit_pkid,
      tax_pkid: vm.itemData.tax_pkid,
      currency_code: vm.itemData.currency_code,
      name: vm.itemData.name,
      purchase_price: vm.itemData.purchase_price,
      selling_price: vm.itemData.selling_price,
      description: vm.itemData.description,
      status: vm.itemData.status,
      sku: vm.itemData.sku,
      barcode: vm.itemData.barcode,
      weight: vm.itemData.weight,
      dimensions: vm.itemData.dimensions,
    };

    const [affectedCount, updatedModels] = await this.repository.update(req, pkid, allowedUpdates);

    if (affectedCount === 0) {
      throw new Error(getMessage(req, MessagesKey.NOCHANGESMADE));
    }

    const updatedModel = updatedModels[0];
    if (!updatedModel) {
      throw new Error(getMessage(req, MessagesKey.ERRORUPDATE));
    }

    return await this.convertToResultDTO(updatedModel);
  }
  //endregion

  //region Delete & Restore methods
  async softDeleteItem(req: Request, pkid: number): Promise<void> {
    await super.softDelete(req, pkid);
  }

  async hardDeleteItem(req: Request, pkid: number): Promise<void> {
    await super.hardDelete(req, pkid);
  }

  async restoreItem(req: Request, pkid: number): Promise<void> {
    await super.restore(req, pkid);
  }
  //endregion

  //region Generate CSV
  async generateCsvItem(req: Request, itemIds?: number[]): Promise<string> {
    try {
      return await generateCSVItem(req, itemIds);
    } catch (error) {
      throw new Error(getMessage(req, MessagesKey.ERRORGENERATECSV));
    }
  }
  //endregion
}
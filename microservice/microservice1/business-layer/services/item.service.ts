import { Request } from 'express';
import { BaseService } from '../common/base.service';
import { ItemCreateVM, ItemUpdateVM } from '../../helpers/view-models/item.vm';
import {
  getAllAttributes,
  getItemDropdownAttributes,
  ItemCreateDTO,
  ItemDropdownDTO,
  ItemResultDTO,
} from '../../helpers/dto/item.dto';
import { ItemRepository } from '../../data-access/repositories/item.repository';
import { ItemAttributes } from '../../infrastructure/models/item.model';
import { CreationAttributes, Model, WhereOptions } from 'sequelize';
import { formatMessage, getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import {
  findCurrencyByCriteria,
  findTaxByID,
} from '../../data-access/integrations/generalSystem.integration';
import { CodeGenerator } from '../../helpers/utility/generateCode';
import { ItemCategoryRepository } from '../../data-access/repositories/itemCategory.repository';
import {
  getAllAttributes as getItemCategoryAttributes,
  ItemCategoryResultDTO,
  removeAuditColumnsFromItemCategory,
} from '../../helpers/dto/itemCategory.dto';
import { findCoaByID } from '../../data-access/integrations/generalLedger.integration';
import { ItemCategoryAttributes } from '../../infrastructure/models/itemCategory.model';
import { generateCSVItem } from '../../helpers/utility/csv/generateCsvItem';
import { removeAuditColumnsFromCoa } from '../../helpers/dto/external/coa.dto';
import { UnitRepository } from '../../data-access/repositories/unit.repository';
import {
  getAllAttributes as getUnitAttributes,
  removeAuditColumnsFromUnit,
  UnitResultDTO,
} from '../../helpers/dto/unit.dto';

export class ItemService extends BaseService<Model<ItemAttributes>> {
  private itemCategoryRepository: ItemCategoryRepository;
  private unitRepository: UnitRepository;

  constructor() {
    super(new ItemRepository());
    this.itemCategoryRepository = new ItemCategoryRepository();
    this.unitRepository = new UnitRepository();
  }

  //region Helper methods
  private async convertToResultDTO(
    model: Model<ItemAttributes>,
    includeCoa: boolean = true,
  ): Promise<ItemResultDTO> {
    const item = model.toJSON() as ItemAttributes;
    let currency;
    let tax;
    let itemCategory: ItemCategoryResultDTO | undefined;
    let unit: UnitResultDTO | undefined;

    if (item.currency_code) {
      const response = await findCurrencyByCriteria({
        code: item.currency_code,
      });
      if (
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        currency = response.data.data[0];
      }
    }

    if (item.tax_pkid) {
      const response = await findTaxByID(item.tax_pkid);
      if (response.data && response.data.data) {
        tax = response.data.data;
      }
    }

    if (item.item_category_pkid) {
      const itemCategoryModel = await this.itemCategoryRepository.findByID(
        {} as Request,
        item.item_category_pkid,
      );
      if (itemCategoryModel) {
        const itemCategoryData =
          itemCategoryModel.toJSON() as ItemCategoryAttributes & { coa?: any };
        if (includeCoa && itemCategoryData.coa_pkid) {
          const response = await findCoaByID(itemCategoryData.coa_pkid);
          if (response.data && response.data.data) {
            itemCategoryData.coa = response.data.data;
          }
        }
        itemCategory = getItemCategoryAttributes(
          removeAuditColumnsFromItemCategory(itemCategoryData),
          itemCategoryData.coa
            ? removeAuditColumnsFromCoa(itemCategoryData.coa)
            : undefined,
        );
      }
    }

    if (item.unit_pkid) {
      const unitModel = await this.unitRepository.findByID(
        {} as Request,
        item.unit_pkid,
      );
      if (unitModel) {
        unit = getUnitAttributes(
          removeAuditColumnsFromUnit(unitModel.toJSON()),
        );
      }
    }

    return getAllAttributes(item, currency, tax, itemCategory, unit);
  }
  //endregion

  //region Find methods
  async findAllItems(req: Request): Promise<ItemResultDTO[]> {
    const items = await super.findAll(req);
    return await Promise.all(
      items.map((item) => this.convertToResultDTO(item, false)),
    );
  }

  async findItemByID(
    req: Request,
    pkid: number,
  ): Promise<ItemResultDTO | null> {
    const item = await super.findByPKID(req, pkid);
    if (item) {
      return await this.convertToResultDTO(item);
    }
    return null;
  }

  async findItemsByCriteria(
    req: Request,
    criteria: any,
  ): Promise<ItemResultDTO[]> {
    const where: WhereOptions<ItemAttributes> = {};
    if (criteria.code) where.code = criteria.code;
    if (criteria.name) where.name = criteria.name;

    const items = await this.where(req, where);
    return await Promise.all(
      items.map((item) => this.convertToResultDTO(item, false)),
    );
  }

  async findItemsByCategory(
    req: Request,
    itemCategoryPkid: number,
  ): Promise<ItemResultDTO[]> {
    const where: WhereOptions<ItemAttributes> = {
      item_category_pkid: itemCategoryPkid,
    };
    const items = await this.where(req, where);
    return await Promise.all(
      items.map((item) => this.convertToResultDTO(item, false)),
    );
  }

  async findAllItemsForDropdown(req: Request): Promise<ItemDropdownDTO[]> {
    const items = await super.findAll(req);
    return await Promise.all(
      items.map((item) =>
        getItemDropdownAttributes(item.toJSON() as ItemAttributes),
      ),
    );
  }

  async findItemsForDropdownByCategory(
    req: Request,
    itemCategoryPkid: number,
  ): Promise<ItemDropdownDTO[]> {
    const where: WhereOptions<ItemAttributes> = {
      item_category_pkid: itemCategoryPkid,
    };
    const items = await this.where(req, where);
    return await Promise.all(
      items.map((item) =>
        getItemDropdownAttributes(item.toJSON() as ItemAttributes),
      ),
    );
  }
  //endregion

  //region Create methods
  async createItem(req: Request, vm: ItemCreateVM): Promise<ItemResultDTO> {
    const generatedCode = await CodeGenerator.generateItemCode(
      vm.itemData.item_category_pkid,
    );

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
      const message = getMessage(req, MessagesKey.ERRORCREATION);
      const formattedMessage = formatMessage(message, ['item']);
      throw new Error(formattedMessage);
    }

    return await this.convertToResultDTO(createdItem);
  }
  //endregion

  //region Update methods
  async updateItem(
    req: Request,
    pkid: number,
    vm: ItemUpdateVM,
  ): Promise<ItemResultDTO> {
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

    const [affectedCount, updatedModels] = await this.repository.update(
      req,
      pkid,
      allowedUpdates,
    );

    if (affectedCount === 0) {
      const message = getMessage(req, MessagesKey.NOCHANGESMADE);
      throw new Error(message);
    }

    const updatedModel = updatedModels[0];
    if (!updatedModel) {
      const message = getMessage(req, MessagesKey.ERRORUPDATE);
      throw new Error(message);
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

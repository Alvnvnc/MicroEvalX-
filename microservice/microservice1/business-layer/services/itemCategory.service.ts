import { Request } from 'express';
import { BaseService } from '../common/base.service';
import {
  getAllAttributes,
  getItemCategoryDropdownAttributes,
  ItemCategoryDropdownDTO,
  ItemCategoryResultDTO,
} from '../../helpers/dto/itemCategory.dto';
import { ItemCategoryRepository } from '../../data-access/repositories/itemCategory.repository';
import { ItemCategoryAttributes } from '../../infrastructure/models/itemCategory.model';
import { Model, WhereOptions } from 'sequelize';
import { getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { findCoaByID } from '../../data-access/integrations/generalLedger.integration';
import { generateCSVItemCategory } from '../../helpers/utility/csv/generateCsvItemCategory';
import { removeAuditColumnsFromCoa } from '../../helpers/dto/external/coa.dto';

export class ItemCategoryService extends BaseService<
  Model<ItemCategoryAttributes>
> {
  constructor() {
    super(new ItemCategoryRepository());
  }

  //region Helper methods
  private async convertToResultDTO(
    model: Model<ItemCategoryAttributes>,
  ): Promise<ItemCategoryResultDTO> {
    const itemCategory = model.toJSON() as ItemCategoryAttributes;
    let coa;

    if (itemCategory.coa_pkid) {
      const response = await findCoaByID(itemCategory.coa_pkid);
      if (response.data && response.data.data) {
        coa = removeAuditColumnsFromCoa(response.data.data);
      }
    }

    return getAllAttributes(itemCategory, coa);
  }

  private async convertToDropdownDTO(
    model: Model<ItemCategoryAttributes>,
  ): Promise<ItemCategoryDropdownDTO> {
    const itemCategory = model.toJSON() as ItemCategoryAttributes;
    return getItemCategoryDropdownAttributes(itemCategory);
  }
  //endregion

  //region Find methods
  async findAllItemCategories(req: Request): Promise<ItemCategoryResultDTO[]> {
    const itemCategories = await super.findAll(req);
    return await Promise.all(
      itemCategories.map(this.convertToResultDTO.bind(this)),
    );
  }

  async findItemCategoryByID(
    req: Request,
    pkid: number,
  ): Promise<ItemCategoryResultDTO | null> {
    const itemCategory = await super.findByPKID(req, pkid);
    if (itemCategory) {
      return await this.convertToResultDTO(itemCategory);
    }
    return null;
  }

  async findItemCategoriesByCriteria(
    req: Request,
    { code, name }: { code?: string; name?: string },
  ): Promise<ItemCategoryResultDTO[]> {
    const criteria: WhereOptions<ItemCategoryAttributes> = {};
    if (code) criteria.code = code;
    if (name) criteria.name = name;

    const itemCategories = await this.where(req, criteria);
    return await Promise.all(
      itemCategories.map(this.convertToResultDTO.bind(this)),
    );
  }

  async findAllItemCategoriesForDropdown(
    req: Request,
  ): Promise<ItemCategoryDropdownDTO[]> {
    const itemCategories = await super.findAll(req);
    return await Promise.all(
      itemCategories.map(this.convertToDropdownDTO.bind(this)),
    );
  }
  //endregion

  //region Generate CSV
  async generateCsvItemCategory(
    req: Request,
    itemCategoryIds?: number[],
  ): Promise<string> {
    try {
      return await generateCSVItemCategory(req, itemCategoryIds);
    } catch (error) {
      throw new Error(getMessage(req, MessagesKey.ERRORGENERATECSV));
    }
  }
  //endregion
}

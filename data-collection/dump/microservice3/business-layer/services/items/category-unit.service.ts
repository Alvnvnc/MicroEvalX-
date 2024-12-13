// items/category-unit.service.ts
import { Request } from 'express';
import { BaseService } from '../../common/base.service';
import { ItemCategoryRepository } from '../../../data-access/repositories/itemCategory.repository';
import { UnitRepository } from '../../../data-access/repositories/unit.repository';
import { ItemCategoryAttributes } from '../../../infrastructure/models/itemCategory.model';
import { UnitAttributes } from '../../../infrastructure/models/unit.model';
import { Model } from 'sequelize';
import { findCoaByID } from '../../../data-access/integrations/generalLedger.integration';
import { 
  getAllAttributes as getItemCategoryAttributes,
  ItemCategoryResultDTO,
  ItemCategoryDropdownDTO,
  getItemCategoryDropdownAttributes,
} from '../../../helpers/dto/itemCategory.dto';
import {
  getAllAttributes as getUnitAttributes,
  UnitResultDTO,
  UnitDropdownDTO,
  getUnitDropdownAttributes,
} from '../../../helpers/dto/unit.dto';
import { removeAuditColumnsFromCoa } from '../../../helpers/dto/external/coa.dto';

export class CategoryUnitService {
  private itemCategoryRepository: ItemCategoryRepository;
  private unitRepository: UnitRepository;

  constructor() {
    this.itemCategoryRepository = new ItemCategoryRepository();
    this.unitRepository = new UnitRepository();
  }

  //region Item Category methods
  private async convertToCategoryResultDTO(model: Model<ItemCategoryAttributes>): Promise<ItemCategoryResultDTO> {
    const itemCategory = model.toJSON() as ItemCategoryAttributes;
    let coa;

    if (itemCategory.coa_pkid) {
      const response = await findCoaByID(itemCategory.coa_pkid);
      if (response.data?.data) {
        coa = removeAuditColumnsFromCoa(response.data.data);
      }
    }

    return getItemCategoryAttributes(itemCategory, coa);
  }

  async findItemCategoryByID(req: Request, pkid: number): Promise<ItemCategoryResultDTO | null> {
    const itemCategory = await this.itemCategoryRepository.findByID(req, pkid);
    if (itemCategory) {
      return await this.convertToCategoryResultDTO(itemCategory);
    }
    return null;
  }

  async findAllItemCategories(req: Request): Promise<ItemCategoryResultDTO[]> {
    const itemCategories = await this.itemCategoryRepository.findAll(req);
    return await Promise.all(itemCategories.map(this.convertToCategoryResultDTO.bind(this)));
  }

  async getItemCategoriesDropdown(req: Request): Promise<ItemCategoryDropdownDTO[]> {
    const itemCategories = await this.itemCategoryRepository.findAll(req);
    return itemCategories.map(category => 
      getItemCategoryDropdownAttributes(category.toJSON() as ItemCategoryAttributes)
    );
  }
  //endregion

  //region Unit methods
  private async convertToUnitResultDTO(model: Model<UnitAttributes>): Promise<UnitResultDTO> {
    return model.toJSON() as UnitResultDTO;
  }

  async findUnitByID(req: Request, pkid: number): Promise<UnitResultDTO | null> {
    const unit = await this.unitRepository.findByID(req, pkid);
    if (unit) {
      return await this.convertToUnitResultDTO(unit);
    }
    return null;
  }

  async findAllUnits(req: Request): Promise<UnitResultDTO[]> {
    const units = await this.unitRepository.findAll(req);
    return await Promise.all(units.map(this.convertToUnitResultDTO.bind(this)));
  }

  async getUnitsDropdown(req: Request): Promise<UnitDropdownDTO[]> {
    const units = await this.unitRepository.findAll(req);
    return units.map(unit => 
      getUnitDropdownAttributes(unit.toJSON() as UnitAttributes)
    );
  }
  //endregion
}
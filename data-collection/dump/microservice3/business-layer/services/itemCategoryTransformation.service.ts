// itemCategoryTransformation.service.ts
import {
    getAllAttributes,
    getItemCategoryDropdownAttributes,
    ItemCategoryDropdownDTO,
    ItemCategoryResultDTO,
  } from '../../helpers/dto/itemCategory.dto';
  import { ItemCategoryAttributes } from '../../infrastructure/models/itemCategory.model';
  import { Model } from 'sequelize';
  import { findCoaByID } from '../../data-access/integrations/generalLedger.integration';
  import { removeAuditColumnsFromCoa } from '../../helpers/dto/external/coa.dto';
  
  export class ItemCategoryTransformationService {
    async convertToResultDTO(
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
  
    async convertToDropdownDTO(
      model: Model<ItemCategoryAttributes>,
    ): Promise<ItemCategoryDropdownDTO> {
      const itemCategory = model.toJSON() as ItemCategoryAttributes;
      return getItemCategoryDropdownAttributes(itemCategory);
    }
  }
  
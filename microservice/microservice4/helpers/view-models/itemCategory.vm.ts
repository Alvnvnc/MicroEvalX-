import {
  ItemCategoryResultDTO,
  getAllAttributes,
} from '../dto/itemCategory.dto';
import { ItemCategoryAttributes } from '../../infrastructure/models/itemCategory.model';

export class ItemCategoryResultVM {
  result: ItemCategoryResultDTO;

  constructor(result: ItemCategoryResultDTO) {
    this.result = result;
  }
}

export const getAllAttributesVM = (
  itemCategory: ItemCategoryAttributes,
): ItemCategoryResultDTO => {
  return getAllAttributes(itemCategory);
};

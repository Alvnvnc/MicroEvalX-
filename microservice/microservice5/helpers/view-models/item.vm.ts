import {
  ItemCreateDTO,
  ItemUpdateDTO,
  ItemResultDTO,
  getAllAttributes,
} from '../dto/item.dto';
import { ItemAttributes } from '../../infrastructure/models/item.model';

export class ItemCreateVM {
  itemData: ItemCreateDTO;

  constructor(itemData: ItemCreateDTO) {
    this.itemData = itemData;
  }
}

export class ItemUpdateVM {
  itemData: ItemUpdateDTO;

  constructor(itemData: ItemUpdateDTO) {
    this.itemData = itemData;
  }
}

export class ItemResultVM {
  result: ItemResultDTO;

  constructor(result: ItemResultDTO) {
    this.result = result;
  }
}

export const getAllAttributesVM = (item: ItemAttributes): ItemResultDTO => {
  return getAllAttributes(item);
};

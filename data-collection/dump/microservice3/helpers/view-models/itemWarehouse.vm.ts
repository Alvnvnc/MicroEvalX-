import {
  ItemWarehouseCreateDTO,
  ItemWarehouseUpdateDTO,
  ItemWarehouseResultDTO,
  getAllAttributes,
} from '../dto/itemWarehouse.dto';
import { ItemWarehouseAttributes } from '../../infrastructure/models/itemWarehouse.model';

export class ItemWarehouseCreateVM {
  itemWarehouseData: ItemWarehouseCreateDTO;

  constructor(itemWarehouseData: ItemWarehouseCreateDTO) {
    this.itemWarehouseData = itemWarehouseData;
  }
}

export class ItemWarehouseUpdateVM {
  itemWarehouseData: ItemWarehouseUpdateDTO;

  constructor(itemWarehouseData: ItemWarehouseUpdateDTO) {
    this.itemWarehouseData = itemWarehouseData;
  }
}

export class ItemWarehouseResultVM {
  result: ItemWarehouseResultDTO;

  constructor(result: ItemWarehouseResultDTO) {
    this.result = result;
  }
}

export const getAllAttributesVM = (
  itemWarehouse: ItemWarehouseAttributes,
): ItemWarehouseResultDTO => {
  return getAllAttributes(itemWarehouse);
};

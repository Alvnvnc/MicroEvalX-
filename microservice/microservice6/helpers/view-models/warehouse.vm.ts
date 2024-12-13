import {
  WarehouseCreateDTO,
  WarehouseUpdateDTO,
  WarehouseResultDTO,
  getAllAttributes,
} from '../dto/warehouse.dto';
import { WarehouseAttributes } from '../../infrastructure/models/warehouse.model';

export class WarehouseCreateVM {
  warehouseData: WarehouseCreateDTO;

  constructor(warehouseData: WarehouseCreateDTO) {
    this.warehouseData = warehouseData;
  }
}

export class WarehouseUpdateVM {
  warehouseData: WarehouseUpdateDTO;

  constructor(warehouseData: WarehouseUpdateDTO) {
    this.warehouseData = warehouseData;
  }
}

export class WarehouseResultVM {
  result: WarehouseResultDTO;

  constructor(result: WarehouseResultDTO) {
    this.result = result;
  }
}

export const getAllAttributesVM = (
  warehouse: WarehouseAttributes,
): WarehouseResultDTO => {
  return getAllAttributes(warehouse);
};

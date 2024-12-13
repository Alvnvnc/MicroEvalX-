import {
  UnitCreateDTO,
  UnitUpdateDTO,
  UnitResultDTO,
  getAllAttributes,
} from '../dto/unit.dto';
import { UnitAttributes } from '../../infrastructure/models/unit.model';

export class UnitCreateVM {
  unitData: UnitCreateDTO;

  constructor(unitData: UnitCreateDTO) {
    this.unitData = unitData;
  }
}

export class UnitUpdateVM {
  unitData: UnitUpdateDTO;

  constructor(unitData: UnitUpdateDTO) {
    this.unitData = unitData;
  }
}

export class UnitResultVM {
  result: UnitResultDTO;

  constructor(result: UnitResultDTO) {
    this.result = result;
  }
}

export const getAllAttributesVM = (unit: UnitAttributes): UnitResultDTO => {
  return getAllAttributes(unit);
};

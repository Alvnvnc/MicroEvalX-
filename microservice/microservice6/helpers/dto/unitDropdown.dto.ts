
import { UnitAttributes } from '../../infrastructure/models/unit/unitAttributes.model';

export interface UnitDropdownDTO {
  pkid: number;
  code: string;
  name: string;
}

export const getUnitDropdownAttributes = (
  unit: UnitAttributes,
): UnitDropdownDTO => {
  return {
    pkid: unit.pkid,
    code: unit.code,
    name: unit.name,
  };
};
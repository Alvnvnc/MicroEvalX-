
import { UnitAttributes } from '../../infrastructure/models/unit/unitAttributes.model';

export interface UnitUpdateDTO {
  name?: string;
  description?: string;
  symbol?: string;
  conversion_factor?: number;
  base_unit?: boolean;
  category?: string;
  status?: boolean;
}
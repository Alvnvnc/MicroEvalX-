import { BaseEntity } from '../../interfaces/baseEntity.model';
import { UnitCategory } from '../../../helpers/enum/unitCategory.enum';

export interface UnitAttributes extends BaseEntity {
  pkid: number;
  code: string;
  name: string;
  description?: string;
  symbol: string;
  conversion_factor?: number;
  base_unit: boolean;
  category: UnitCategory;
  status: boolean;
}
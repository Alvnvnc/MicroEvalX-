
import { UnitAttributes } from '../../infrastructure/models/unit/unitAttributes.model';

export interface UnitResultDTO {
  pkid: number;
  code: string;
  name: string;
  description?: string;
  symbol: string;
  conversion_factor?: number;
  base_unit: boolean;
  category: string;
  status: boolean;
  tenant_id?: number;
  created_by?: string;
  created_date?: Date;
  created_host?: string;
  updated_by?: string;
  updated_date?: Date;
  updated_host?: string;
  is_deleted?: boolean;
  deleted_by?: string;
  deleted_date?: Date;
  deleted_host?: string;
}

export const getAllAttributes = (unit: UnitAttributes): UnitResultDTO => {
  return {
    pkid: unit.pkid,
    code: unit.code,
    name: unit.name,
    description: unit.description,
    symbol: unit.symbol,
    conversion_factor: unit.conversion_factor,
    base_unit: unit.base_unit,
    category: unit.category,
    status: unit.status,
    tenant_id: unit.tenant_id,
    created_by: unit.created_by,
    created_date: unit.created_date,
    created_host: unit.created_host,
    updated_by: unit.updated_by,
    updated_date: unit.updated_date,
    updated_host: unit.updated_host,
    is_deleted: unit.is_deleted,
    deleted_by: unit.deleted_by,
    deleted_date: unit.deleted_date,
    deleted_host: unit.deleted_host,
  };
};
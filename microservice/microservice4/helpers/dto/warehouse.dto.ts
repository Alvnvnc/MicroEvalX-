import { WarehouseAttributes } from '../../infrastructure/models/warehouse.model';

export interface WarehouseDTO {
  pkid: number;
  code: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  contact_number?: string;
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

export interface WarehouseCreateDTO {
  code: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  contact_number?: string;
  status: boolean;
}

export interface WarehouseUpdateDTO {
  code?: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  contact_number?: string;
  status?: boolean;
}

export interface WarehouseResultDTO extends WarehouseDTO {}

export interface WarehouseDropdownDTO {
  pkid: number;
  code: string;
  name: string;
}

export const removeAuditColumnsFromWarehouse = (
  warehouseData: any,
): WarehouseDTO => {
  const {
    tenant_id,
    created_by,
    created_date,
    created_host,
    updated_by,
    updated_date,
    updated_host,
    is_deleted,
    deleted_by,
    deleted_date,
    deleted_host,
    ...cleanedWarehouse
  } = warehouseData;
  return cleanedWarehouse;
};

export const getAllAttributes = (
  warehouse: WarehouseAttributes,
): WarehouseResultDTO => {
  return {
    pkid: warehouse.pkid,
    code: warehouse.code,
    name: warehouse.name,
    address: warehouse.address,
    city: warehouse.city,
    state: warehouse.state,
    country: warehouse.country,
    postal_code: warehouse.postal_code,
    contact_number: warehouse.contact_number,
    status: warehouse.status,
    tenant_id: warehouse.tenant_id,
    created_by: warehouse.created_by,
    created_date: warehouse.created_date,
    created_host: warehouse.created_host,
    updated_by: warehouse.updated_by,
    updated_date: warehouse.updated_date,
    updated_host: warehouse.updated_host,
    is_deleted: warehouse.is_deleted,
    deleted_by: warehouse.deleted_by,
    deleted_date: warehouse.deleted_date,
    deleted_host: warehouse.deleted_host,
  };
};

export const getWarehouseDropdownAttributes = (
  warehouse: WarehouseAttributes,
): WarehouseDropdownDTO => {
  return {
    pkid: warehouse.pkid,
    code: warehouse.code,
    name: warehouse.name,
  };
};

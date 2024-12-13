import { ItemWarehouseAttributes } from '../../infrastructure/models/itemWarehouse.model';
import { ItemResultDTO, removeAuditColumnsFromItem } from './item.dto';
import {
  WarehouseResultDTO,
  removeAuditColumnsFromWarehouse,
} from './warehouse.dto';

export interface ItemWarehouseCreateDTO {
  item_pkid: number;
  warehouse_pkid: number;
  quantity: number;
  reorder_level?: number;
  reorder_quantity?: number;
  last_restocked?: Date;
  expiry_date?: Date;
}

export interface ItemWarehouseUpdateDTO {
  item_pkid?: number;
  warehouse_pkid?: number;
  quantity?: number;
  reorder_level?: number;
  reorder_quantity?: number;
  last_restocked?: Date;
  expiry_date?: Date;
}

export interface ItemWarehouseResultDTO {
  pkid: number;
  item_pkid: number;
  warehouse_pkid: number;
  quantity: number;
  reorder_level?: number;
  reorder_quantity?: number;
  last_restocked?: Date;
  expiry_date?: Date;
  item?: ItemResultDTO;
  warehouse?: WarehouseResultDTO;
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

export interface ItemWarehouseDropdownDTO {
  pkid: number;
  item_pkid: number;
  warehouse_pkid: number;
}

export const removeAuditColumnsFromItemWarehouse = (
  itemWarehouseData: any,
): ItemWarehouseAttributes => {
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
    ...cleanedItemWarehouse
  } = itemWarehouseData;
  return cleanedItemWarehouse;
};

export const getAllAttributes = (
  itemWarehouse: ItemWarehouseAttributes,
  item?: ItemResultDTO,
  warehouse?: WarehouseResultDTO,
): ItemWarehouseResultDTO => {
  return {
    pkid: itemWarehouse.pkid,
    item_pkid: itemWarehouse.item_pkid,
    warehouse_pkid: itemWarehouse.warehouse_pkid,
    quantity: itemWarehouse.quantity,
    reorder_level: itemWarehouse.reorder_level,
    reorder_quantity: itemWarehouse.reorder_quantity,
    last_restocked: itemWarehouse.last_restocked,
    expiry_date: itemWarehouse.expiry_date,
    item: item ? removeAuditColumnsFromItem(item) : undefined,
    warehouse: warehouse
      ? removeAuditColumnsFromWarehouse(warehouse)
      : undefined,
    tenant_id: itemWarehouse.tenant_id,
    created_by: itemWarehouse.created_by,
    created_date: itemWarehouse.created_date,
    created_host: itemWarehouse.created_host,
    updated_by: itemWarehouse.updated_by,
    updated_date: itemWarehouse.updated_date,
    updated_host: itemWarehouse.updated_host,
    is_deleted: itemWarehouse.is_deleted,
    deleted_by: itemWarehouse.deleted_by,
    deleted_date: itemWarehouse.deleted_date,
    deleted_host: itemWarehouse.deleted_host,
  };
};

export const getItemWarehouseDropdownAttributes = (
  itemWarehouse: ItemWarehouseAttributes,
): ItemWarehouseDropdownDTO => {
  return {
    pkid: itemWarehouse.pkid,
    item_pkid: itemWarehouse.item_pkid,
    warehouse_pkid: itemWarehouse.warehouse_pkid,
  };
};

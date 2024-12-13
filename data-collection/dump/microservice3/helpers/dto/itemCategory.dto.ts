import { ItemCategoryAttributes } from '../../infrastructure/models/itemCategory.model';
import { CoaDTO, removeAuditColumnsFromCoa } from './external/coa.dto';

export interface ItemCategoryResultDTO {
  pkid: number;
  code: string;
  coa_pkid?: number;
  name: string;
  description?: string;
  status: boolean;
  coa?: CoaDTO;
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

export interface ItemCategoryDropdownDTO {
  pkid: number;
  code: string;
  name: string;
}

export const removeAuditColumnsFromItemCategory = (
  itemCategoryData: any,
): ItemCategoryAttributes => {
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
    ...cleanedItemCategory
  } = itemCategoryData;
  return cleanedItemCategory;
};

export const getAllAttributes = (
  itemCategory: ItemCategoryAttributes,
  coa?: CoaDTO,
): ItemCategoryResultDTO => {
  return {
    pkid: itemCategory.pkid,
    code: itemCategory.code,
    coa_pkid: itemCategory.coa_pkid,
    name: itemCategory.name,
    description: itemCategory.description,
    status: itemCategory.status,
    tenant_id: itemCategory.tenant_id,
    coa: coa ? removeAuditColumnsFromCoa(coa) : undefined,
    created_by: itemCategory.created_by,
    created_date: itemCategory.created_date,
    created_host: itemCategory.created_host,
    updated_by: itemCategory.updated_by,
    updated_date: itemCategory.updated_date,
    updated_host: itemCategory.updated_host,
    is_deleted: itemCategory.is_deleted,
    deleted_by: itemCategory.deleted_by,
    deleted_date: itemCategory.deleted_date,
    deleted_host: itemCategory.deleted_host,
  };
};

export const getItemCategoryDropdownAttributes = (
  itemCategory: ItemCategoryAttributes,
): ItemCategoryDropdownDTO => {
  return {
    pkid: itemCategory.pkid,
    code: itemCategory.code,
    name: itemCategory.name,
  };
};

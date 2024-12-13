import { ItemAttributes } from '../../infrastructure/models/item.model';
import {
  CurrencyDTO,
  removeAuditColumnsFromCurrency,
} from './external/currency.dto';
import { TaxDTO, removeAuditColumnsFromTax } from './external/tax.dto';
import {
  ItemCategoryResultDTO,
  removeAuditColumnsFromItemCategory,
} from './itemCategory.dto';
import { UnitResultDTO, removeAuditColumnsFromUnit } from './unit.dto';

export interface ItemDTO {
  pkid: number;
  code: string;
  item_category_pkid: number;
  unit_pkid: number;
  tax_pkid?: number;
  currency_code: string;
  name: string;
  purchase_price?: number;
  selling_price?: number;
  description?: string;
  status: boolean;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: number;
  currency?: CurrencyDTO;
  tax?: TaxDTO;
  item_category?: ItemCategoryResultDTO;
  unit?: UnitResultDTO;
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

export interface ItemCreateDTO {
  code: string;
  item_category_pkid: number;
  unit_pkid: number;
  tax_pkid?: number;
  currency_code: string;
  name: string;
  purchase_price?: number;
  selling_price?: number;
  description?: string;
  status: boolean;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: number;
}

export interface ItemUpdateDTO {
  code?: string;
  item_category_pkid?: number;
  unit_pkid?: number;
  tax_pkid?: number;
  currency_code?: string;
  name?: string;
  purchase_price?: number;
  selling_price?: number;
  description?: string;
  status?: boolean;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: number;
}

export interface ItemResultDTO extends ItemDTO {}

export interface ItemDropdownDTO {
  pkid: number;
  code: string;
  name: string;
}

export const removeAuditColumnsFromItem = (itemData: any): ItemAttributes => {
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
    ...cleanedItem
  } = itemData;
  return cleanedItem;
};

export const getAllAttributes = (
  item: ItemAttributes,
  currency?: CurrencyDTO,
  tax?: TaxDTO,
  itemCategory?: ItemCategoryResultDTO,
  unit?: UnitResultDTO,
): ItemResultDTO => {
  return {
    pkid: item.pkid,
    code: item.code,
    item_category_pkid: item.item_category_pkid,
    unit_pkid: item.unit_pkid,
    tax_pkid: item.tax_pkid,
    currency_code: item.currency_code,
    name: item.name,
    purchase_price: item.purchase_price,
    selling_price: item.selling_price,
    description: item.description,
    status: item.status,
    sku: item.sku,
    barcode: item.barcode,
    weight: item.weight,
    dimensions: item.dimensions,
    currency: currency ? removeAuditColumnsFromCurrency(currency) : undefined,
    tax: tax ? removeAuditColumnsFromTax(tax) : undefined,
    item_category: itemCategory
      ? removeAuditColumnsFromItemCategory(itemCategory)
      : undefined,
    unit: unit ? removeAuditColumnsFromUnit(unit) : undefined,
    tenant_id: item.tenant_id,
    created_by: item.created_by,
    created_date: item.created_date,
    created_host: item.created_host,
    updated_by: item.updated_by,
    updated_date: item.updated_date,
    updated_host: item.updated_host,
    is_deleted: item.is_deleted,
    deleted_by: item.deleted_by,
    deleted_date: item.deleted_date,
    deleted_host: item.deleted_host,
  };
};

export const getItemDropdownAttributes = (
  item: ItemAttributes,
): ItemDropdownDTO => {
  return {
    pkid: item.pkid,
    code: item.code,
    name: item.name,
  };
};

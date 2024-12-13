import { BomHeaderAttributes } from '../../infrastructure/models/bomHeader.model';
import { BomDetailAttributes } from '../../infrastructure/models/bomDetail.model';
import { ItemDTO, removeAuditColumnsFromItem } from './item.dto';
import { BomStatus } from '../enum/bomStatus.enum';

export interface BomDetailInputDTO {
  pkid?: number;
  item_detail_pkid: number;
  quantity: number;
  wastage_percentage?: number;
  cost?: number;
  level?: number;
  notes?: string;
  parent_bom_detail_pkid?: number;
  unique_parent?: number;
  item_code?: string;
  childBomDetails?: BomDetailInputDTO[];
}

export interface BomHeaderCreateDTO {
  code: string;
  item_header_pkid: number;
  production_quantity: number;
  total_cost?: number;
  description?: string;
  status: BomStatus;
  effective_date?: Date;
  expiration_date?: Date;
  unique_parent?: number;
  item_code?: string;
  bomDetails: BomDetailInputDTO[];
}

export interface BomDetailUpdateDTO {
  pkid: number;
  item_detail_pkid?: number;
  quantity?: number;
  wastage_percentage?: number;
  cost?: number;
  level?: number;
  notes?: string;
  parent_bom_detail_pkid?: number;
  unique_parent?: number;
  item_code?: string;
}

export interface BomHeaderUpdateDTO {
  code?: string;
  item_header_pkid?: number;
  production_quantity?: number;
  total_cost?: number;
  description?: string;
  status?: BomStatus;
  effective_date?: Date;
  expiration_date?: Date;
  unique_parent?: number;
  item_code?: string;
  bomDetails?: BomDetailUpdateDTO[];
}

export interface BomDetailResultDTO {
  pkid: number;
  bom_header_pkid: number;
  item_detail_pkid: number;
  quantity: number;
  wastage_percentage?: number;
  cost?: number;
  level: number;
  notes?: string;
  parent_bom_detail_pkid?: number;
  unique_parent?: number;
  item_code?: string;
  item_name?: string;
  item?: ItemDTO;
  childBomDetails?: BomDetailResultDTO[];
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

export interface BomHeaderResultDTO {
  pkid: number;
  code: string;
  item_header_pkid: number;
  production_quantity: number;
  total_cost?: number;
  description?: string;
  status: BomStatus;
  effective_date?: Date;
  expiration_date?: Date;
  unique_parent?: number;
  item_code?: string;
  item_name?: string;
  bomDetails?: BomDetailResultDTO[];
  itemHeader?: ItemDTO;
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

export interface BomHeaderDropdownDTO {
  pkid: number;
  code: string;
}

export const removeAuditColumnsFromBomHeader = (
  bomHeaderData: any,
): Omit<BomHeaderAttributes, 'bomDetails'> => {
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
    ...cleanedBomHeader
  } = bomHeaderData;

  return cleanedBomHeader;
};

export const removeAuditColumnsFromBomDetail = (
  bomDetailData: any,
): BomDetailAttributes => {
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
    ...cleanedBomDetail
  } = bomDetailData;
  return cleanedBomDetail;
};

export const getAllAttributes = (
  bomHeader: BomHeaderAttributes,
  bomDetails?: BomDetailResultDTO[],
  itemHeader?: ItemDTO,
): BomHeaderResultDTO => {
  return {
    pkid: bomHeader.pkid,
    code: bomHeader.code,
    item_header_pkid: bomHeader.item_header_pkid,
    production_quantity: bomHeader.production_quantity,
    total_cost: bomHeader.total_cost,
    description: bomHeader.description,
    status: bomHeader.status,
    effective_date: bomHeader.effective_date,
    expiration_date: bomHeader.expiration_date,
    unique_parent: bomHeader.unique_parent,
    item_code: bomHeader.item_code,
    item_name: itemHeader?.name ?? undefined,
    tenant_id: bomHeader.tenant_id,
    created_by: bomHeader.created_by,
    created_date: bomHeader.created_date,
    created_host: bomHeader.created_host,
    updated_by: bomHeader.updated_by,
    updated_date: bomHeader.updated_date,
    updated_host: bomHeader.updated_host,
    is_deleted: bomHeader.is_deleted,
    deleted_by: bomHeader.deleted_by,
    deleted_date: bomHeader.deleted_date,
    deleted_host: bomHeader.deleted_host,
    bomDetails: bomDetails,
    itemHeader: itemHeader ? removeAuditColumnsFromItem(itemHeader) : undefined,
  };
};

export const getAllAttributesForDetail = (
  bomDetail: BomDetailAttributes,
  item?: ItemDTO,
  childBomDetails?: BomDetailResultDTO[],
): BomDetailResultDTO => {
  return {
    pkid: bomDetail.pkid,
    bom_header_pkid: bomDetail.bom_header_pkid,
    item_detail_pkid: bomDetail.item_detail_pkid,
    quantity: bomDetail.quantity,
    wastage_percentage: bomDetail.wastage_percentage,
    cost: bomDetail.cost,
    level: bomDetail.level,
    notes: bomDetail.notes,
    parent_bom_detail_pkid: bomDetail.parent_bom_detail_pkid,
    unique_parent: bomDetail.unique_parent,
    item_code: bomDetail.item_code,
    item_name: item?.name ?? undefined,
    item: item ? removeAuditColumnsFromItem(item) : undefined,
    childBomDetails: childBomDetails,
    tenant_id: bomDetail.tenant_id,
    created_by: bomDetail.created_by,
    created_date: bomDetail.created_date,
    created_host: bomDetail.created_host,
    updated_by: bomDetail.updated_by,
    updated_date: bomDetail.updated_date,
    updated_host: bomDetail.updated_host,
    is_deleted: bomDetail.is_deleted,
    deleted_by: bomDetail.deleted_by,
    deleted_date: bomDetail.deleted_date,
    deleted_host: bomDetail.deleted_host,
  };
};

export const getBomHeaderDropdownAttributes = (
  bomHeader: BomHeaderAttributes,
): BomHeaderDropdownDTO => {
  return {
    pkid: bomHeader.pkid,
    code: bomHeader.code,
  };
};

export const mapBomHeaderToCSV = (bomHeader: BomHeaderResultDTO) => ({
  pkid: bomHeader.pkid,
  code: bomHeader.code,
  item_header_pkid: bomHeader.item_header_pkid,
  production_quantity: bomHeader.production_quantity,
  total_cost: bomHeader.total_cost,
  description: bomHeader.description,
  status: bomHeader.status,
  effective_date: bomHeader.effective_date,
  expiration_date: bomHeader.expiration_date,
  created_by: bomHeader.created_by,
  created_date: bomHeader.created_date,
  created_host: bomHeader.created_host,
  updated_by: bomHeader.updated_by,
  updated_date: bomHeader.updated_date,
  updated_host: bomHeader.updated_host,
  is_deleted: bomHeader.is_deleted,
  deleted_by: bomHeader.deleted_by,
  deleted_date: bomHeader.deleted_date,
  deleted_host: bomHeader.deleted_host,
  unique_parent: bomHeader.unique_parent,
  item_code: bomHeader.item_code,
});

export const mapBomDetailToCSV = (detail: BomDetailResultDTO) => ({
  pkid: detail.pkid,
  bom_header_pkid: detail.bom_header_pkid,
  item_detail_pkid: detail.item_detail_pkid,
  quantity: detail.quantity,
  wastage_percentage: detail.wastage_percentage,
  cost: detail.cost,
  level: detail.level,
  notes: detail.notes,
  created_by: detail.created_by,
  created_date: detail.created_date,
  created_host: detail.created_host,
  updated_by: detail.updated_by,
  updated_date: detail.updated_date,
  updated_host: detail.updated_host,
  is_deleted: detail.is_deleted,
  deleted_by: detail.deleted_by,
  deleted_date: detail.deleted_date,
  deleted_host: detail.deleted_host,
  unique_parent: detail.unique_parent,
  item_code: detail.item_code,
});

export interface BomAvailabilityDetailDTO {
  itemId: number;
  statusQuantity: boolean;
  requiredQuantity: number;
  currentQuantity: number;
  childBom: BomAvailabilityDetailDTO[];
  parentDetailPkid?: number;
}

export interface BomAvailabilityResultDTO {
  endProduct: Omit<BomAvailabilityDetailDTO, 'childBom'>;
  childItems: BomAvailabilityDetailDTO[];
}

export interface BomListItemDTO {
  pkid?: number;
  code: string;
  item_header_pkid: number;
  item_code?: string;
  production_quantity: number;
  total_cost?: number;
  description?: string;
  status: BomStatus;
  effective_date?: Date;
  expiration_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface ChildItemDTO {
  pkid?: number;
  item_code: string;
  item_name?: string;
  quantity: number;
  wastage_percentage?: number;
  cost?: number;
  level?: number;
  notes?: string;
  parent_bom_detail_pkid?: number;
  unique_parent?: number;
  child_items?: ChildItemDTO[];
}
import { TransferAttributes } from '../../infrastructure/models/transfer.model';
import { TransferDetailAttributes } from '../../infrastructure/models/transferDetail.model';
import { ItemDTO, removeAuditColumnsFromItem } from './item.dto';
import { TransferStatus } from '../enum/transferStatus.enum';
import { TransferType } from '../enum/transferType.enum';
import { WarehouseDTO, removeAuditColumnsFromWarehouse } from './warehouse.dto';
import {
  SupplierDTO,
  removeAuditColumnsFromSupplier,
} from './external/supplier.dto';
import {
  CustomerDTO,
  removeAuditColumnsFromCustomer,
} from './external/customer.dto';
import {
  PurchaseOrderDTO,
  removeAuditColumnsFromPurchaseOrder,
} from './external/purchaseOrder.dto';
import {
  removeAuditColumnsFromSalesOrder,
  SalesOrderDTO,
} from './external/salesOrder.dto';

export interface TransferDetailInputDTO {
  pkid?: number;
  item_pkid: number;
  item_quantity: number;
  item_accepted_quantity?: number;
  item_rejected_quantity?: number;
  expiry_date?: Date;
  notes?: string;
}

export interface TransferCreateDTO {
  from_warehouse_pkid?: number;
  to_warehouse_pkid?: number;
  supplier_pkid?: number;
  customer_pkid?: number;
  reference_number?: string;
  transfer_date: Date;
  status: TransferStatus;
  type: TransferType;
  total_quantity?: number;
  total_accepted_quantity?: number;
  total_rejected_quantity?: number;
  description?: string;
  transferDetails: TransferDetailInputDTO[];
}

export interface TransferDetailUpdateDTO {
  pkid: number;
  item_accepted_quantity?: number;
  item_rejected_quantity?: number;
  expiry_date?: Date;
  notes?: string;
}

export interface TransferUpdateDTO {
  code?: string;
  from_warehouse_pkid?: number;
  to_warehouse_pkid?: number;
  supplier_pkid?: number;
  customer_pkid?: number;
  reference_number?: string;
  transfer_date?: Date;
  status?: TransferStatus;
  type?: TransferType;
  total_quantity?: number;
  total_accepted_quantity?: number;
  total_rejected_quantity?: number;
  description?: string;
  transferDetails?: TransferDetailUpdateDTO[];
}

export interface TransferDetailResultDTO {
  pkid: number;
  transfer_pkid: number;
  item_pkid: number;
  item_quantity: number;
  item_accepted_quantity?: number;
  item_rejected_quantity?: number;
  expiry_date?: Date;
  notes?: string;
  item?: ItemDTO;
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

export interface TransferResultDTO {
  pkid: number;
  code: string;
  from_warehouse_pkid?: number;
  to_warehouse_pkid?: number;
  supplier_pkid?: number;
  customer_pkid?: number;
  reference_number?: string;
  transfer_date: Date;
  status: TransferStatus;
  type: TransferType;
  total_quantity?: number;
  total_accepted_quantity?: number;
  total_rejected_quantity?: number;
  description?: string;
  transferDetails?: TransferDetailResultDTO[];
  fromWarehouse?: WarehouseDTO;
  toWarehouse?: WarehouseDTO;
  supplier?: SupplierDTO;
  customer?: CustomerDTO;
  purchaseOrder?: PurchaseOrderDTO;
  salesOrder?: SalesOrderDTO;
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

export interface TransferDropdownDTO {
  pkid: number;
  code: string;
}

export const removeAuditColumnsFromTransfer = (
  transferData: any,
): Omit<TransferAttributes, 'fromWarehouse' | 'toWarehouse'> => {
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
    ...cleanedTransfer
  } = transferData;

  return cleanedTransfer;
};

export const removeAuditColumnsFromTransferDetail = (
  transferDetailData: any,
): TransferDetailAttributes => {
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
    ...cleanedTransferDetail
  } = transferDetailData;
  return cleanedTransferDetail;
};

export const getAllAttributes = (
  transfer: TransferAttributes,
  transferDetails?: TransferDetailResultDTO[],
  fromWarehouse?: WarehouseDTO,
  toWarehouse?: WarehouseDTO,
  supplier?: SupplierDTO,
  customer?: CustomerDTO,
  purchaseOrder?: PurchaseOrderDTO,
  salesOrder?: SalesOrderDTO,
): TransferResultDTO => {
  return {
    pkid: transfer.pkid,
    code: transfer.code,
    from_warehouse_pkid: transfer.from_warehouse_pkid,
    to_warehouse_pkid: transfer.to_warehouse_pkid,
    supplier_pkid: transfer.supplier_pkid,
    customer_pkid: transfer.customer_pkid,
    reference_number: transfer.reference_number,
    transfer_date: transfer.transfer_date,
    status: transfer.status,
    type: transfer.type,
    total_quantity: transfer.total_quantity,
    total_accepted_quantity: transfer.total_accepted_quantity,
    total_rejected_quantity: transfer.total_rejected_quantity,
    description: transfer.description,
    tenant_id: transfer.tenant_id,
    created_by: transfer.created_by,
    created_date: transfer.created_date,
    created_host: transfer.created_host,
    updated_by: transfer.updated_by,
    updated_date: transfer.updated_date,
    updated_host: transfer.updated_host,
    is_deleted: transfer.is_deleted,
    deleted_by: transfer.deleted_by,
    deleted_date: transfer.deleted_date,
    deleted_host: transfer.deleted_host,
    transferDetails: transferDetails,
    fromWarehouse: fromWarehouse
      ? removeAuditColumnsFromWarehouse(fromWarehouse)
      : undefined,
    toWarehouse: toWarehouse
      ? removeAuditColumnsFromWarehouse(toWarehouse)
      : undefined,
    supplier: supplier ? removeAuditColumnsFromSupplier(supplier) : undefined,
    customer: customer ? removeAuditColumnsFromCustomer(customer) : undefined,
    purchaseOrder: purchaseOrder
      ? removeAuditColumnsFromPurchaseOrder(purchaseOrder)
      : undefined,
    salesOrder: salesOrder
      ? removeAuditColumnsFromSalesOrder(salesOrder)
      : undefined,
  };
};

export const getAllAttributesForDetail = (
  transferDetail: TransferDetailAttributes,
  item?: ItemDTO,
): TransferDetailResultDTO => {
  return {
    pkid: transferDetail.pkid,
    transfer_pkid: transferDetail.transfer_pkid,
    item_pkid: transferDetail.item_pkid,
    item_quantity: transferDetail.item_quantity,
    item_accepted_quantity: transferDetail.item_accepted_quantity,
    item_rejected_quantity: transferDetail.item_rejected_quantity,
    expiry_date: transferDetail.expiry_date,
    notes: transferDetail.notes,
    item: item ? removeAuditColumnsFromItem(item) : undefined,
    tenant_id: transferDetail.tenant_id,
    created_by: transferDetail.created_by,
    created_date: transferDetail.created_date,
    created_host: transferDetail.created_host,
    updated_by: transferDetail.updated_by,
    updated_date: transferDetail.updated_date,
    updated_host: transferDetail.updated_host,
    is_deleted: transferDetail.is_deleted,
    deleted_by: transferDetail.deleted_by,
    deleted_date: transferDetail.deleted_date,
    deleted_host: transferDetail.deleted_host,
  };
};

export const getTransferDropdownAttributes = (
  transfer: TransferAttributes,
): TransferDropdownDTO => {
  return {
    pkid: transfer.pkid,
    code: transfer.code,
  };
};

export const mapTransferToCSV = (transfer: TransferResultDTO) => ({
  pkid: transfer.pkid,
  code: transfer.code,
  from_warehouse_pkid: transfer.from_warehouse_pkid,
  to_warehouse_pkid: transfer.to_warehouse_pkid,
  supplier_pkid: transfer.supplier_pkid,
  customer_pkid: transfer.customer_pkid,
  reference_number: transfer.reference_number,
  transfer_date: transfer.transfer_date,
  status: transfer.status,
  type: transfer.type,
  total_quantity: transfer.total_quantity,
  total_accepted_quantity: transfer.total_accepted_quantity,
  total_rejected_quantity: transfer.total_rejected_quantity,
  description: transfer.description,
  created_by: transfer.created_by,
  created_date: transfer.created_date,
  created_host: transfer.created_host,
  updated_by: transfer.updated_by,
  updated_date: transfer.updated_date,
  updated_host: transfer.updated_host,
  is_deleted: transfer.is_deleted,
  deleted_by: transfer.deleted_by,
  deleted_date: transfer.deleted_date,
  deleted_host: transfer.deleted_host,
});

export const mapTransferDetailToCSV = (detail: TransferDetailResultDTO) => ({
  pkid: detail.pkid,
  transfer_pkid: detail.transfer_pkid,
  item_pkid: detail.item_pkid,
  item_quantity: detail.item_quantity,
  item_accepted_quantity: detail.item_accepted_quantity,
  item_rejected_quantity: detail.item_rejected_quantity,
  expiry_date: detail.expiry_date,
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
});

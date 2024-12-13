import { ReceiveAttributes } from '../../infrastructure/models/receive.model';
import { ReceiveDetailAttributes } from '../../infrastructure/models/receiveDetail.model';
import { ItemDTO, removeAuditColumnsFromItem } from './item.dto';
import { ReceiveStatus } from '../enum/receiveStatus.enum';
import { ReceiveType } from '../enum/receiveType.enum';
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
  SalesOrderDTO,
  removeAuditColumnsFromSalesOrder,
} from './external/salesOrder.dto';

export interface ReceiveDetailInputDTO {
  pkid?: number;
  item_pkid: number;
  item_quantity: number;
  item_accepted_quantity?: number;
  item_rejected_quantity?: number;
  expiry_date?: Date;
  notes?: string;
}

export interface ReceiveCreateDTO {
  warehouse_pkid?: number;
  supplier_pkid?: number;
  customer_pkid?: number;
  reference_number?: string;
  received_date: Date;
  status: ReceiveStatus;
  type: ReceiveType;
  total_quantity?: number;
  total_accepted_quantity?: number;
  total_rejected_quantity?: number;
  is_rejected: boolean;
  description?: string;
  receiveDetails: ReceiveDetailInputDTO[];
}

export interface ReceiveDetailUpdateDTO {
  pkid: number;
  item_accepted_quantity?: number;
  item_rejected_quantity?: number;
  expiry_date?: Date;
  notes?: string;
}

export interface ReceiveUpdateDTO {
  code?: string;
  warehouse_pkid?: number;
  supplier_pkid?: number;
  customer_pkid?: number;
  reference_number?: string;
  received_date?: Date;
  status?: ReceiveStatus;
  type?: ReceiveType;
  total_quantity?: number;
  total_accepted_quantity?: number;
  total_rejected_quantity?: number;
  is_rejected?: boolean;
  description?: string;
  receiveDetails?: ReceiveDetailUpdateDTO[];
}

export interface ReceiveDetailResultDTO {
  pkid: number;
  receive_pkid: number;
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

export interface ReceiveResultDTO {
  pkid: number;
  code: string;
  warehouse_pkid?: number;
  supplier_pkid?: number;
  customer_pkid?: number;
  reference_number?: string;
  received_date: Date;
  status: ReceiveStatus;
  type: ReceiveType;
  total_quantity?: number;
  total_accepted_quantity?: number;
  total_rejected_quantity?: number;
  is_rejected: boolean;
  description?: string;
  receiveDetails?: ReceiveDetailResultDTO[];
  warehouse?: WarehouseDTO;
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

export interface ReceiveDropdownDTO {
  pkid: number;
  code: string;
}

export const removeAuditColumnsFromReceive = (
  receiveData: any,
): Omit<ReceiveAttributes, 'purchaseOrder' | 'salesOrder' | 'warehouse'> => {
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
    ...cleanedReceive
  } = receiveData;

  return cleanedReceive;
};

export const removeAuditColumnsFromReceiveDetail = (
  receiveDetailData: any,
): ReceiveDetailAttributes => {
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
    ...cleanedReceiveDetail
  } = receiveDetailData;
  return cleanedReceiveDetail;
};

export const getAllAttributes = (
  receive: ReceiveAttributes,
  receiveDetails?: ReceiveDetailResultDTO[],
  warehouse?: WarehouseDTO,
  supplier?: SupplierDTO,
  customer?: CustomerDTO,
  purchaseOrder?: PurchaseOrderDTO,
  salesOrder?: SalesOrderDTO,
): ReceiveResultDTO => {
  return {
    pkid: receive.pkid,
    code: receive.code,
    warehouse_pkid: receive.warehouse_pkid,
    supplier_pkid: receive.supplier_pkid,
    customer_pkid: receive.customer_pkid,
    reference_number: receive.reference_number,
    received_date: receive.received_date,
    status: receive.status,
    type: receive.type,
    total_quantity: receive.total_quantity,
    total_accepted_quantity: receive.total_accepted_quantity,
    total_rejected_quantity: receive.total_rejected_quantity,
    is_rejected: receive.is_rejected,
    description: receive.description,
    tenant_id: receive.tenant_id,
    created_by: receive.created_by,
    created_date: receive.created_date,
    created_host: receive.created_host,
    updated_by: receive.updated_by,
    updated_date: receive.updated_date,
    updated_host: receive.updated_host,
    is_deleted: receive.is_deleted,
    deleted_by: receive.deleted_by,
    deleted_date: receive.deleted_date,
    deleted_host: receive.deleted_host,
    receiveDetails: receiveDetails,
    warehouse: warehouse
      ? removeAuditColumnsFromWarehouse(warehouse)
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
  receiveDetail: ReceiveDetailAttributes,
  item?: ItemDTO,
): ReceiveDetailResultDTO => {
  return {
    pkid: receiveDetail.pkid,
    receive_pkid: receiveDetail.receive_pkid,
    item_pkid: receiveDetail.item_pkid,
    item_quantity: receiveDetail.item_quantity,
    item_accepted_quantity: receiveDetail.item_accepted_quantity,
    item_rejected_quantity: receiveDetail.item_rejected_quantity,
    expiry_date: receiveDetail.expiry_date,
    notes: receiveDetail.notes,
    item: item ? removeAuditColumnsFromItem(item) : undefined,
    tenant_id: receiveDetail.tenant_id,
    created_by: receiveDetail.created_by,
    created_date: receiveDetail.created_date,
    created_host: receiveDetail.created_host,
    updated_by: receiveDetail.updated_by,
    updated_date: receiveDetail.updated_date,
    updated_host: receiveDetail.updated_host,
    is_deleted: receiveDetail.is_deleted,
    deleted_by: receiveDetail.deleted_by,
    deleted_date: receiveDetail.deleted_date,
    deleted_host: receiveDetail.deleted_host,
  };
};

export const getReceiveDropdownAttributes = (
  receive: ReceiveAttributes,
): ReceiveDropdownDTO => {
  return {
    pkid: receive.pkid,
    code: receive.code,
  };
};

export const mapReceiveToCSV = (receive: ReceiveResultDTO) => ({
  pkid: receive.pkid,
  code: receive.code,
  warehouse_pkid: receive.warehouse_pkid,
  supplier_pkid: receive.supplier_pkid,
  customer_pkid: receive.customer_pkid,
  reference_number: receive.reference_number,
  received_date: receive.received_date,
  status: receive.status,
  type: receive.type,
  total_quantity: receive.total_quantity,
  total_accepted_quantity: receive.total_accepted_quantity,
  total_rejected_quantity: receive.total_rejected_quantity,
  is_rejected: receive.is_rejected,
  description: receive.description,
  created_by: receive.created_by,
  created_date: receive.created_date,
  created_host: receive.created_host,
  updated_by: receive.updated_by,
  updated_date: receive.updated_date,
  updated_host: receive.updated_host,
  is_deleted: receive.is_deleted,
  deleted_by: receive.deleted_by,
  deleted_date: receive.deleted_date,
  deleted_host: receive.deleted_host,
});

export const mapReceiveDetailToCSV = (detail: ReceiveDetailResultDTO) => ({
  pkid: detail.pkid,
  receive_pkid: detail.receive_pkid,
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

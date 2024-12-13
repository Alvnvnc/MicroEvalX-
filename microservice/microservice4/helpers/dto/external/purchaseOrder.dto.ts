import { SupplierDTO, removeAuditColumnsFromSupplier } from './supplier.dto';
import { ItemDTO, removeAuditColumnsFromItem } from '../item.dto';

export interface PurchaseOrderDetailDTO {
  pkid: number;
  purchase_order_pkid: number;
  item_pkid: number;
  currency_code: string;
  quantity: string;
  price_per_item: string;
  total_price: string;
  description: string;
  item?: ItemDTO;
}

export interface PurchaseOrderDTO {
  pkid: number;
  code: string;
  purchase_request_id: number;
  supplier_id: number;
  currency_code: string;
  requested_date: Date;
  order_date: Date;
  delivery_date: Date;
  status: string;
  delivery_status: string;
  payment_status: string;
  total_amount: string;
  description: string;
  purchaseOrderDetails: PurchaseOrderDetailDTO[];
  supplier?: SupplierDTO;
}

export const removeAuditColumnsFromPurchaseOrderDetail = (
  detailData: any,
): PurchaseOrderDetailDTO => {
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
    item,
    ...cleanedDetail
  } = detailData;

  return {
    ...cleanedDetail,
    item: item ? (removeAuditColumnsFromItem(item) as ItemDTO) : undefined,
  };
};

export const removeAuditColumnsFromPurchaseOrder = (
  poData: any,
): PurchaseOrderDTO => {
  const {
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
    purchaseOrderDetails,
    supplier,
    ...cleanedPO
  } = poData;

  return {
    ...cleanedPO,
    purchaseOrderDetails: purchaseOrderDetails?.map((detail: any) =>
      removeAuditColumnsFromPurchaseOrderDetail(detail),
    ),
    supplier: supplier ? removeAuditColumnsFromSupplier(supplier) : undefined,
  };
};

import { CustomerDTO, removeAuditColumnsFromCustomer } from './customer.dto';
import { ItemDTO, removeAuditColumnsFromItem } from '../item.dto';

export interface SalesOrderDetailDTO {
  pkid: number;
  sales_order_pkid: number;
  item_pkid: number;
  currency_code: string;
  quantity: string;
  price_per_item: string;
  total_price: string;
  description: string;
  item?: ItemDTO;
}

export interface SalesOrderDTO {
  pkid: number;
  code: string;
  customer_id: number;
  currency_code: string;
  order_date: Date;
  delivery_date: Date | null;
  status: string;
  delivery_status: string;
  payment_status: string;
  total_amount: string;
  description: string;
  salesOrderDetails: SalesOrderDetailDTO[];
  customer?: CustomerDTO;
}

export const removeAuditColumnsFromSalesOrderDetail = (
  detailData: any,
): SalesOrderDetailDTO => {
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
    item: item ? removeAuditColumnsFromItem(item) : undefined,
  };
};

export const removeAuditColumnsFromSalesOrder = (
  soData: any,
): SalesOrderDTO => {
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
    salesOrderDetails,
    customer,
    ...cleanedSO
  } = soData;

  return {
    ...cleanedSO,
    salesOrderDetails: salesOrderDetails?.map((detail: any) =>
      removeAuditColumnsFromSalesOrderDetail(detail),
    ),
    customer: customer ? removeAuditColumnsFromCustomer(customer) : undefined,
  };
};

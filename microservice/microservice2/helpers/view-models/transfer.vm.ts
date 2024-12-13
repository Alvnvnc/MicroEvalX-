import {
  TransferCreateDTO,
  TransferUpdateDTO,
  TransferResultDTO,
  TransferDetailResultDTO,
  getAllAttributes,
  getAllAttributesForDetail,
} from '../dto/transfer.dto';
import { TransferAttributes } from '../../infrastructure/models/transfer.model';
import { TransferDetailAttributes } from '../../infrastructure/models/transferDetail.model';
import { ItemDTO } from '../dto/item.dto';
import { SupplierDTO } from '../dto/external/supplier.dto';
import { CustomerDTO } from '../dto/external/customer.dto';
import { WarehouseDTO } from '../dto/warehouse.dto';
import { PurchaseOrderDTO } from '../dto/external/purchaseOrder.dto';
import { SalesOrderDTO } from '../dto/external/salesOrder.dto';

export class TransferCreateVM {
  transferData: TransferCreateDTO;

  constructor(transferData: TransferCreateDTO) {
    this.transferData = transferData;
  }
}

export class TransferUpdateVM {
  transferData: TransferUpdateDTO;

  constructor(transferData: TransferUpdateDTO) {
    this.transferData = transferData;
  }
}

export class TransferResultVM {
  result: TransferResultDTO;

  constructor(result: TransferResultDTO) {
    this.result = result;
  }
}

export class TransferDetailResultVM {
  result: TransferDetailResultDTO;

  constructor(result: TransferDetailResultDTO) {
    this.result = result;
  }
}

export const getAllAttributesVM = (
  transfer: TransferAttributes,
  transferDetails?: TransferDetailResultDTO[],
  fromWarehouse?: WarehouseDTO,
  toWarehouse?: WarehouseDTO,
  supplier?: SupplierDTO,
  customer?: CustomerDTO,
  purchaseOrder?: PurchaseOrderDTO,
  salesOrder?: SalesOrderDTO,
): TransferResultDTO => {
  return getAllAttributes(
    transfer,
    transferDetails,
    fromWarehouse,
    toWarehouse,
    supplier,
    customer,
    purchaseOrder,
    salesOrder,
  );
};

export const getAllAttributesForDetailVM = (
  transferDetail: TransferDetailAttributes,
  item?: ItemDTO,
): TransferDetailResultDTO => {
  return getAllAttributesForDetail(transferDetail, item);
};

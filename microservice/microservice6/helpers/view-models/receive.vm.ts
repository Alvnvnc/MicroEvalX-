import {
  ReceiveCreateDTO,
  ReceiveUpdateDTO,
  ReceiveResultDTO,
  ReceiveDetailResultDTO,
  getAllAttributes,
  getAllAttributesForDetail,
} from '../dto/receive.dto';
import { ReceiveAttributes } from '../../infrastructure/models/receive.model';
import { ReceiveDetailAttributes } from '../../infrastructure/models/receiveDetail.model';
import { ItemDTO } from '../dto/item.dto';
import { SupplierDTO } from '../dto/external/supplier.dto';
import { CustomerDTO } from '../dto/external/customer.dto';
import { WarehouseDTO } from '../dto/warehouse.dto';
import { PurchaseOrderDTO } from '../dto/external/purchaseOrder.dto';
import { SalesOrderDTO } from '../dto/external/salesOrder.dto';

export class ReceiveCreateVM {
  receiveData: ReceiveCreateDTO;

  constructor(receiveData: ReceiveCreateDTO) {
    this.receiveData = receiveData;
  }
}

export class ReceiveUpdateVM {
  receiveData: ReceiveUpdateDTO;

  constructor(receiveData: ReceiveUpdateDTO) {
    this.receiveData = receiveData;
  }
}

export class ReceiveResultVM {
  result: ReceiveResultDTO;

  constructor(result: ReceiveResultDTO) {
    this.result = result;
  }
}

export class ReceiveDetailResultVM {
  result: ReceiveDetailResultDTO;

  constructor(result: ReceiveDetailResultDTO) {
    this.result = result;
  }
}

export const getAllAttributesVM = (
  receive: ReceiveAttributes,
  receiveDetails?: ReceiveDetailResultDTO[],
  purchaseOrder?: PurchaseOrderDTO,
  salesOrder?: SalesOrderDTO,
  warehouse?: WarehouseDTO,
  supplier?: SupplierDTO,
  customer?: CustomerDTO,
): ReceiveResultDTO => {
  return getAllAttributes(
    receive,
    receiveDetails,
    warehouse,
    supplier,
    customer,
    purchaseOrder,
    salesOrder,
  );
};

export const getAllAttributesForDetailVM = (
  receiveDetail: ReceiveDetailAttributes,
  item?: ItemDTO,
): ReceiveDetailResultDTO => {
  return getAllAttributesForDetail(receiveDetail, item);
};

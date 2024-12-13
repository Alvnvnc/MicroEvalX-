import { Request } from 'express';
import { BaseService } from '../common/base.service';
import {
  ReceiveCreateVM,
  getAllAttributesVM,
  getAllAttributesForDetailVM,
  ReceiveUpdateVM,
} from '../../helpers/view-models/receive.vm';
import {
  ReceiveCreateDTO,
  ReceiveResultDTO,
  ReceiveDropdownDTO,
  getReceiveDropdownAttributes,
} from '../../helpers/dto/receive.dto';
import { ReceiveRepository } from '../../data-access/repositories/receive.repository';
import { ReceiveDetailRepository } from '../../data-access/repositories/receiveDetail.repository';
import { ItemService } from './item.service';
import { WarehouseRepository } from '../../data-access/repositories/warehouse.repository';
import {
  findSupplierByID,
  findPurchaseOrderByCode,
} from '../../data-access/integrations/purchasing.integration';
import {
  findCustomerByID,
  findSalesOrderByCode,
} from '../../data-access/integrations/sales.integration';
import {
  ReceiveAttributes,
  ReceiveWithDetailsAttributes,
} from '../../infrastructure/models/receive.model';
import { ReceiveDetailAttributes } from '../../infrastructure/models/receiveDetail.model';
import { CreationAttributes, Model, WhereOptions } from 'sequelize';
import { generateCSVReceive } from '../../helpers/utility/csv/generateCsvReceive';
import db from '../../infrastructure/models';
import { getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { ReceiveType } from '../../helpers/enum/receiveType.enum';
import { removeAuditColumnsFromSupplier } from '../../helpers/dto/external/supplier.dto';
import { removeAuditColumnsFromCustomer } from '../../helpers/dto/external/customer.dto';
import { removeAuditColumnsFromPurchaseOrder } from '../../helpers/dto/external/purchaseOrder.dto';
import { removeAuditColumnsFromSalesOrder } from '../../helpers/dto/external/salesOrder.dto';
import { removeAuditColumnsFromItem } from '../../helpers/dto/item.dto';
import { CodeGenerator } from '../../helpers/utility/generateCode';
import { ReceiveStatus } from '../../helpers/enum/receiveStatus.enum';
import { ItemWarehouseService } from './itemWarehouse.service';

export class ReceiveService extends BaseService<Model<ReceiveAttributes>> {
  private receiveRepository: ReceiveRepository;
  private receiveDetailRepository: ReceiveDetailRepository;
  private itemService: ItemService;
  private warehouseRepository: WarehouseRepository;
  private itemWarehouseService: ItemWarehouseService;

  constructor() {
    super(new ReceiveRepository());
    this.receiveRepository = new ReceiveRepository();
    this.receiveDetailRepository = new ReceiveDetailRepository();
    this.itemService = new ItemService();
    this.warehouseRepository = new WarehouseRepository();
    this.itemWarehouseService = new ItemWarehouseService();
  }

  //region Helper methods
  private async convertToResultDTO(
    model: Model<ReceiveAttributes>,
  ): Promise<ReceiveResultDTO> {
    const receive = model.toJSON() as ReceiveAttributes;

    // Get related data
    const details = await this.receiveDetailRepository.where({} as Request, {
      receive_pkid: receive.pkid,
    });
    const detailsDTO = await Promise.all(
      details.map(async (detail) => {
        const itemDTO = await this.itemService.findItemByID(
          {} as Request,
          detail.get('item_pkid') as number,
        );
        return getAllAttributesForDetailVM(
          detail.toJSON() as ReceiveDetailAttributes,
          removeAuditColumnsFromItem(itemDTO),
        );
      }),
    );

    let warehouse;
    if (receive.warehouse_pkid) {
      const warehouseModel = await this.warehouseRepository.findByID(
        {} as Request,
        receive.warehouse_pkid,
      );
      if (warehouseModel) {
        warehouse = warehouseModel.toJSON();
      }
    }

    let supplier;
    if (receive.supplier_pkid) {
      const supplierData = await findSupplierByID(receive.supplier_pkid);
      if (supplierData) {
        supplier = removeAuditColumnsFromSupplier(supplierData.data.data);
      } else {
        throw new Error(
          getMessage({} as Request, MessagesKey.SUPPLIERNOTFOUND),
        );
      }
    }

    let customer;
    if (receive.customer_pkid) {
      const customerData = await findCustomerByID(receive.customer_pkid);
      if (customerData) {
        customer = removeAuditColumnsFromCustomer(customerData.data.data);
      } else {
        throw new Error(
          getMessage({} as Request, MessagesKey.CUSTOMERNOTFOUND),
        );
      }
    }

    let purchaseOrder;
    let salesOrder;
    if (receive.type === ReceiveType.PURCHASE && receive.reference_number) {
      const purchaseOrderData = await findPurchaseOrderByCode(
        receive.reference_number,
      );
      if (purchaseOrderData) {
        purchaseOrder = removeAuditColumnsFromPurchaseOrder(
          purchaseOrderData.data.data[0],
        );
      } else {
        throw new Error(
          getMessage({} as Request, MessagesKey.PURCHASEORDERNOTFOUND),
        );
      }
    } else if (receive.type === ReceiveType.SALES && receive.reference_number) {
      const salesOrderData = await findSalesOrderByCode(
        receive.reference_number,
      );
      if (salesOrderData) {
        salesOrder = removeAuditColumnsFromSalesOrder(
          salesOrderData.data.data[0],
        );
      } else {
        throw new Error(
          getMessage({} as Request, MessagesKey.SALESORDERNOTFOUND),
        );
      }
    }

    return getAllAttributesVM(
      receive,
      detailsDTO,
      purchaseOrder,
      salesOrder,
      warehouse,
      supplier,
      customer,
    );
  }

  private async convertToDropdownDTO(
    model: Model<ReceiveAttributes>,
  ): Promise<ReceiveDropdownDTO> {
    const receive = model.toJSON() as ReceiveAttributes;
    return getReceiveDropdownAttributes(receive);
  }

  //endregion

  //region Find methods
  async findAllReceives(req: Request): Promise<ReceiveResultDTO[]> {
    const receives = await super.findAll(req);
    return await Promise.all(
      receives.map((receive) => this.convertToResultDTO(receive)),
    );
  }

  async findReceiveByID(
    req: Request,
    pkid: number,
  ): Promise<ReceiveResultDTO | null> {
    const receive = await super.findByPKID(req, pkid);
    if (receive) {
      return await this.convertToResultDTO(receive);
    }
    return null;
  }

  async findReceivesByCriteria(
    req: Request,
    criteria: any,
  ): Promise<ReceiveResultDTO[]> {
    const where: WhereOptions<ReceiveAttributes> = {};
    if (criteria.code) where.code = criteria.code;
    if (criteria.reference_number)
      where.reference_number = criteria.reference_number;

    const receives = await this.where(req, where);
    return await Promise.all(
      receives.map((receive) => this.convertToResultDTO(receive)),
    );
  }

  async getReceivesDropdown(req: Request): Promise<ReceiveDropdownDTO[]> {
    const receives = await super.findAll(req);
    return await Promise.all(
      receives.map((receive) => this.convertToDropdownDTO(receive)),
    );
  }

  async findAllReceiveHeaders(req: Request): Promise<ReceiveResultDTO[]> {
    const receives = await this.receiveRepository.findAllHeaders(req);
    return receives.map((receive) => getAllAttributesVM(receive, []));
  }
  //endregion

  //region Create methods
  async createReceive(
    req: Request,
    vm: ReceiveCreateVM,
  ): Promise<ReceiveResultDTO> {
    const dto: ReceiveCreateDTO = {
      ...vm.receiveData,
    };

    dto.status = ReceiveStatus.PENDING;

    if (!Object.values(ReceiveType).includes(dto.type)) {
      throw new Error(getMessage(req, MessagesKey.INVALID_TYPE));
    }

    const transaction = await db.sequelize.transaction();

    try {
      const generatedCode = await CodeGenerator.generateReceiveCode();

      // Create Receive Header
      let total_quantity = 0;
      let total_accepted_quantity = 0;
      let total_rejected_quantity = 0;

      const receiveData: Partial<ReceiveWithDetailsAttributes> = {
        code: generatedCode,
        warehouse_pkid: dto.warehouse_pkid,
        supplier_pkid: dto.supplier_pkid,
        customer_pkid: dto.customer_pkid,
        reference_number: dto.reference_number,
        received_date: dto.received_date,
        status: dto.status,
        type: dto.type,
        description: dto.description,
        total_quantity: 0,
        total_accepted_quantity: 0,
        total_rejected_quantity: 0,
      };

      const createdReceive = await this.receiveRepository.createWithTransaction(
        req,
        receiveData as ReceiveWithDetailsAttributes,
        transaction,
      );

      // Create Receive Details
      const detailsPromises = dto.receiveDetails.map(async (detail) => {
        total_quantity += detail.item_quantity;
        total_accepted_quantity += detail.item_accepted_quantity ?? 0;
        total_rejected_quantity += detail.item_rejected_quantity ?? 0;

        const itemData = await this.itemService.findItemByID(
          req,
          detail.item_pkid,
        );

        return {
          ...detail,
          receive_pkid: createdReceive.get('pkid') as number,
        } as CreationAttributes<Model<ReceiveDetailAttributes>>;
      });

      const details = await Promise.all(detailsPromises);

      // Update total values in Receive header
      createdReceive.set({
        total_quantity,
        total_accepted_quantity,
        total_rejected_quantity,
      });
      await createdReceive.save({ transaction });

      await this.receiveDetailRepository.bulkCreateWithTransaction(
        req,
        details,
        transaction,
      );

      // Update Item Warehouse quantities
      if (
        [
          ReceiveType.PRODUCTION,
          ReceiveType.PURCHASE,
          ReceiveType.SALES,
        ].includes(dto.type)
      ) {
        await Promise.all(
          details.map(async (detail) => {
            await this.itemWarehouseService.addAcceptedQuantityToItemWarehouse(
              req,
              dto.warehouse_pkid!,
              detail.item_pkid,
              detail.item_accepted_quantity!,
            );
          }),
        );
      }

      await transaction.commit();
      return await this.convertToResultDTO(createdReceive);
    } catch (error) {
      await transaction.rollback();
      this.handleError(req, error);
      throw error;
    }
  }
  //endregion

  //region Update methods
  async updateReceive(
    req: Request,
    pkid: number,
    vm: ReceiveUpdateVM,
  ): Promise<ReceiveResultDTO> {
    const allowedUpdates: Partial<ReceiveAttributes> = {
      received_date: vm.receiveData.received_date,
      status: vm.receiveData.status,
      is_rejected: vm.receiveData.is_rejected,
      description: vm.receiveData.description,
    };

    const transaction = await db.sequelize.transaction();

    try {
      const existingReceive = await this.receiveRepository.findByID(req, pkid);
      if (!existingReceive) {
        throw new Error(getMessage(req, MessagesKey.ERRORUPDATE));
      }

      await this.receiveRepository.update(req, pkid, {
        ...allowedUpdates,
        pkid,
      } as ReceiveWithDetailsAttributes);

      let total_quantity = 0;
      let total_accepted_quantity = 0;
      let total_rejected_quantity = 0;

      const detailsPromises = (vm.receiveData.receiveDetails || []).map(
        async (detail) => {
          if (detail.pkid === undefined) {
            throw new Error(getMessage(req, MessagesKey.ERRORFINDINGBYID));
          }

          const allowedDetailUpdates: Partial<ReceiveDetailAttributes> = {
            item_accepted_quantity: detail.item_accepted_quantity,
            item_rejected_quantity: detail.item_rejected_quantity,
            expiry_date: detail.expiry_date,
            notes: detail.notes,
          };

          const existingDetail = await this.receiveDetailRepository.findByID(
            req,
            detail.pkid,
          );
          if (!existingDetail) {
            throw new Error(getMessage(req, MessagesKey.ERRORUPDATE));
          }

          const itemPkid = existingDetail.get('item_pkid') as number;

          const existingAcceptedQuantity = parseFloat(
            existingDetail.get('item_accepted_quantity')?.toString() || '0',
          );
          const newAcceptedQuantity = parseFloat(
            detail.item_accepted_quantity?.toString() || '0',
          );
          const differenceAcceptedQuantity =
            newAcceptedQuantity - existingAcceptedQuantity;

          if (differenceAcceptedQuantity !== 0) {
            await this.itemWarehouseService.addAcceptedQuantityToItemWarehouse(
              req,
              existingReceive.get('warehouse_pkid') as number,
              itemPkid,
              parseFloat(differenceAcceptedQuantity.toFixed(4)),
            );
          }

          total_quantity += parseFloat(
            existingDetail.get('item_quantity')?.toString() || '0',
          );
          total_accepted_quantity += parseFloat(
            detail.item_accepted_quantity?.toString() || '0',
          );
          total_rejected_quantity += parseFloat(
            detail.item_rejected_quantity?.toString() || '0',
          );

          return {
            pkid: detail.pkid!,
            ...allowedDetailUpdates,
          } as CreationAttributes<Model<ReceiveDetailAttributes>>;
        },
      );

      const details = await Promise.all(detailsPromises);

      const existingDetails = await this.receiveDetailRepository.where(req, {
        receive_pkid: pkid,
      });

      const existingDetailIds = existingDetails.map(
        (detail) => detail.get('pkid') as number,
      );
      const updatedDetailIds = details.map((detail) => detail.pkid as number);
      const detailsToDelete = existingDetailIds.filter(
        (id) => !updatedDetailIds.includes(id),
      );

      await this.receiveDetailRepository.bulkUpdateWithTransaction(
        req,
        details.map((detail) => ({
          pkid: detail.pkid!,
          values: detail,
        })),
        transaction,
      );

      await this.receiveDetailRepository.bulkDeleteWithTransaction(
        req,
        detailsToDelete,
        transaction,
      );

      // Update the total values in Receive header within the same transaction
      existingReceive.set({
        total_quantity: parseFloat(total_quantity.toFixed(4)),
        total_accepted_quantity: parseFloat(total_accepted_quantity.toFixed(4)),
        total_rejected_quantity: parseFloat(total_rejected_quantity.toFixed(4)),
      });

      await existingReceive.save({ transaction });

      await transaction.commit();

      const updatedReceive = await this.receiveRepository.findByID(req, pkid);
      return await this.convertToResultDTO(updatedReceive!);
    } catch (error) {
      await transaction.rollback();
      this.handleError(req, error);
      throw error;
    }
  }
  //endregion

  //region Delete & Restore methods
  async softDeleteReceive(req: Request, pkid: number): Promise<void> {
    await super.softDelete(req, pkid);
  }

  async hardDeleteReceive(req: Request, pkid: number): Promise<void> {
    await this.receiveRepository.hardDelete(req, pkid);
  }

  async restoreReceive(req: Request, pkid: number): Promise<void> {
    await super.restore(req, pkid);
  }
  //endregion

  //region Generate CSV
  async generateCsvReceive(req: Request): Promise<string> {
    try {
      const receives = await this.receiveRepository.findAllWithDetails(req);
      return await generateCSVReceive(receives);
    } catch (error) {
      throw new Error(getMessage(req, MessagesKey.ERRORGENERATECSV));
    }
  }
  //endregion
}

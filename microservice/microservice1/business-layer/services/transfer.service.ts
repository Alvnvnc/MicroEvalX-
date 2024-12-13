import { Request } from 'express';
import { BaseService } from '../common/base.service';
import {
  TransferCreateVM,
  getAllAttributesVM,
  getAllAttributesForDetailVM,
  TransferUpdateVM,
} from '../../helpers/view-models/transfer.vm';
import {
  TransferCreateDTO,
  TransferResultDTO,
  TransferDropdownDTO,
  getTransferDropdownAttributes,
} from '../../helpers/dto/transfer.dto';
import { TransferRepository } from '../../data-access/repositories/transfer.repository';
import { TransferDetailRepository } from '../../data-access/repositories/transferDetail.repository';
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
  TransferAttributes,
  TransferWithDetailsAttributes,
} from '../../infrastructure/models/transfer.model';
import { TransferDetailAttributes } from '../../infrastructure/models/transferDetail.model';
import { CreationAttributes, Model, WhereOptions } from 'sequelize';
import { generateCSVTransfer } from '../../helpers/utility/csv/generateCsvTransfer';
import db from '../../infrastructure/models';
import { getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { TransferType } from '../../helpers/enum/transferType.enum';
import { removeAuditColumnsFromSupplier } from '../../helpers/dto/external/supplier.dto';
import { removeAuditColumnsFromCustomer } from '../../helpers/dto/external/customer.dto';
import { removeAuditColumnsFromPurchaseOrder } from '../../helpers/dto/external/purchaseOrder.dto';
import { removeAuditColumnsFromSalesOrder } from '../../helpers/dto/external/salesOrder.dto';
import { removeAuditColumnsFromItem } from '../../helpers/dto/item.dto';
import { CodeGenerator } from '../../helpers/utility/generateCode';
import { TransferStatus } from '../../helpers/enum/transferStatus.enum';
import { ItemWarehouseService } from './itemWarehouse.service';

export class TransferService extends BaseService<Model<TransferAttributes>> {
  private transferRepository: TransferRepository;
  private transferDetailRepository: TransferDetailRepository;
  private itemService: ItemService;
  private warehouseRepository: WarehouseRepository;
  private itemWarehouseService: ItemWarehouseService;

  constructor() {
    super(new TransferRepository());
    this.transferRepository = new TransferRepository();
    this.transferDetailRepository = new TransferDetailRepository();
    this.itemService = new ItemService();
    this.warehouseRepository = new WarehouseRepository();
    this.itemWarehouseService = new ItemWarehouseService();
  }

  //region Helper methods
  private async convertToResultDTO(
    model: Model<TransferAttributes>,
  ): Promise<TransferResultDTO> {
    const transfer = model.toJSON() as TransferAttributes;

    // Get related data
    const details = await this.transferDetailRepository.where({} as Request, {
      transfer_pkid: transfer.pkid,
    });
    const detailsDTO = await Promise.all(
      details.map(async (detail) => {
        const itemDTO = await this.itemService.findItemByID(
          {} as Request,
          detail.get('item_pkid') as number,
        );
        return getAllAttributesForDetailVM(
          detail.toJSON() as TransferDetailAttributes,
          removeAuditColumnsFromItem(itemDTO),
        );
      }),
    );

    let fromWarehouse;
    if (transfer.from_warehouse_pkid) {
      const warehouseModel = await this.warehouseRepository.findByID(
        {} as Request,
        transfer.from_warehouse_pkid,
      );
      if (warehouseModel) {
        fromWarehouse = warehouseModel.toJSON();
      }
    }

    let toWarehouse;
    if (transfer.to_warehouse_pkid) {
      const warehouseModel = await this.warehouseRepository.findByID(
        {} as Request,
        transfer.to_warehouse_pkid,
      );
      if (warehouseModel) {
        toWarehouse = warehouseModel.toJSON();
      }
    }

    let supplier;
    if (transfer.supplier_pkid) {
      const supplierData = await findSupplierByID(transfer.supplier_pkid);
      if (supplierData) {
        supplier = removeAuditColumnsFromSupplier(supplierData.data.data);
      } else {
        throw new Error(
          getMessage({} as Request, MessagesKey.SUPPLIERNOTFOUND),
        );
      }
    }

    let customer;
    if (transfer.customer_pkid) {
      const customerData = await findCustomerByID(transfer.customer_pkid);
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
    if (transfer.type === TransferType.PURCHASE && transfer.reference_number) {
      const purchaseOrderData = await findPurchaseOrderByCode(
        transfer.reference_number,
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
    } else if (
      transfer.type === TransferType.SALES &&
      transfer.reference_number
    ) {
      const salesOrderData = await findSalesOrderByCode(
        transfer.reference_number,
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
      transfer,
      detailsDTO,
      fromWarehouse,
      toWarehouse,
      supplier,
      customer,
      purchaseOrder,
      salesOrder,
    );
  }

  private async convertToDropdownDTO(
    model: Model<TransferAttributes>,
  ): Promise<TransferDropdownDTO> {
    const transfer = model.toJSON() as TransferAttributes;
    return getTransferDropdownAttributes(transfer);
  }

  //endregion

  //region Find methods
  async findAllTransfers(req: Request): Promise<TransferResultDTO[]> {
    const transfers = await super.findAll(req);
    return await Promise.all(
      transfers.map((transfer) => this.convertToResultDTO(transfer)),
    );
  }

  async findTransferByID(
    req: Request,
    pkid: number,
  ): Promise<TransferResultDTO | null> {
    const transfer = await super.findByPKID(req, pkid);
    if (transfer) {
      return await this.convertToResultDTO(transfer);
    }
    return null;
  }

  async findTransfersByCriteria(
    req: Request,
    criteria: any,
  ): Promise<TransferResultDTO[]> {
    const where: WhereOptions<TransferAttributes> = {};
    if (criteria.code) where.code = criteria.code;

    const transfers = await this.where(req, where);
    return await Promise.all(
      transfers.map((transfer) => this.convertToResultDTO(transfer)),
    );
  }

  async getTransfersDropdown(req: Request): Promise<TransferDropdownDTO[]> {
    const transfers = await super.findAll(req);
    return await Promise.all(
      transfers.map((transfer) => this.convertToDropdownDTO(transfer)),
    );
  }

  async findAllTransferHeaders(req: Request): Promise<TransferResultDTO[]> {
    const transfers = await this.transferRepository.findAllHeaders(req);
    return transfers.map((transfer) => getAllAttributesVM(transfer, []));
  }
  //endregion

  //region Create methods
  async createTransfer(
    req: Request,
    vm: TransferCreateVM,
  ): Promise<TransferResultDTO> {
    const dto: TransferCreateDTO = {
      ...vm.transferData,
    };

    dto.status = TransferStatus.PENDING;

    if (!Object.values(TransferType).includes(dto.type)) {
      throw new Error(getMessage(req, MessagesKey.INVALID_TYPE));
    }

    const transaction = await db.sequelize.transaction();

    try {
      const generatedCode = await CodeGenerator.generateTransferCode();

      // Create Transfer Header
      let total_quantity = 0;
      let total_accepted_quantity = 0;
      let total_rejected_quantity = 0;

      const transferData: Partial<TransferWithDetailsAttributes> = {
        code: generatedCode,
        from_warehouse_pkid: dto.from_warehouse_pkid,
        to_warehouse_pkid: dto.to_warehouse_pkid,
        supplier_pkid: dto.supplier_pkid,
        customer_pkid: dto.customer_pkid,
        reference_number: dto.reference_number,
        transfer_date: dto.transfer_date,
        status: dto.status,
        type: dto.type,
        description: dto.description,
        total_quantity: 0,
        total_accepted_quantity: 0,
        total_rejected_quantity: 0,
      };

      const createdTransfer =
        await this.transferRepository.createWithTransaction(
          req,
          transferData as TransferWithDetailsAttributes,
          transaction,
        );

      // Create Transfer Details
      const detailsPromises = dto.transferDetails.map(async (detail) => {
        total_quantity += detail.item_quantity;
        total_accepted_quantity += detail.item_accepted_quantity ?? 0;
        total_rejected_quantity += detail.item_rejected_quantity ?? 0;

        const itemData = await this.itemService.findItemByID(
          req,
          detail.item_pkid,
        );

        if (!dto.to_warehouse_pkid) {
          await this.itemWarehouseService.subtractAcceptedQuantityFromItemWarehouse(
            req,
            dto.from_warehouse_pkid!,
            detail.item_pkid,
            detail.item_accepted_quantity!,
          );
        } else {
          await this.itemWarehouseService.subtractAcceptedQuantityFromItemWarehouse(
            req,
            dto.from_warehouse_pkid!,
            detail.item_pkid,
            detail.item_accepted_quantity!,
          );
          await this.itemWarehouseService.addAcceptedQuantityToItemWarehouse(
            req,
            dto.to_warehouse_pkid,
            detail.item_pkid,
            detail.item_accepted_quantity!,
          );
        }

        return {
          ...detail,
          transfer_pkid: createdTransfer.get('pkid') as number,
        } as CreationAttributes<Model<TransferDetailAttributes>>;
      });

      const details = await Promise.all(detailsPromises);

      // Update total values in Transfer header
      createdTransfer.set({
        total_quantity,
        total_accepted_quantity,
        total_rejected_quantity,
      });
      await createdTransfer.save({ transaction });

      await this.transferDetailRepository.bulkCreateWithTransaction(
        req,
        details,
        transaction,
      );

      await transaction.commit();
      return await this.convertToResultDTO(createdTransfer);
    } catch (error) {
      if (transaction.finished !== 'commit') {
        await transaction.rollback();
      }
      this.handleError(req, error);
      throw error;
    }
  }
  //endregion

  //region Update methods
  async updateTransfer(
    req: Request,
    pkid: number,
    vm: TransferUpdateVM,
  ): Promise<TransferResultDTO> {
    const allowedUpdates: Partial<TransferAttributes> = {
      transfer_date: vm.transferData.transfer_date,
      status: vm.transferData.status,
      description: vm.transferData.description,
    };

    const transaction = await db.sequelize.transaction();

    try {
      const existingTransfer = await this.transferRepository.findByID(
        req,
        pkid,
      );
      if (!existingTransfer) {
        throw new Error(getMessage(req, MessagesKey.ERRORUPDATE));
      }

      await this.transferRepository.update(req, pkid, {
        ...allowedUpdates,
        pkid,
      } as TransferWithDetailsAttributes);

      let total_quantity = 0;
      let total_accepted_quantity = 0;
      let total_rejected_quantity = 0;

      const detailsPromises = (vm.transferData.transferDetails || []).map(
        async (detail) => {
          if (detail.pkid === undefined) {
            throw new Error(getMessage(req, MessagesKey.ERRORFINDINGBYID));
          }

          const allowedDetailUpdates: Partial<TransferDetailAttributes> = {
            item_accepted_quantity: detail.item_accepted_quantity,
            item_rejected_quantity: detail.item_rejected_quantity,
            expiry_date: detail.expiry_date,
            notes: detail.notes,
          };

          const existingDetail = await this.transferDetailRepository.findByID(
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
            if (!existingTransfer.get('to_warehouse_pkid')) {
              await this.itemWarehouseService.subtractAcceptedQuantityFromItemWarehouse(
                req,
                existingTransfer.get('from_warehouse_pkid') as number,
                itemPkid,
                parseFloat(differenceAcceptedQuantity.toFixed(4)),
              );
            } else {
              await this.itemWarehouseService.subtractAcceptedQuantityFromItemWarehouse(
                req,
                existingTransfer.get('from_warehouse_pkid') as number,
                itemPkid,
                parseFloat(differenceAcceptedQuantity.toFixed(4)),
              );
              await this.itemWarehouseService.addAcceptedQuantityToItemWarehouse(
                req,
                existingTransfer.get('to_warehouse_pkid') as number,
                itemPkid,
                parseFloat(differenceAcceptedQuantity.toFixed(4)),
              );
            }
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
          } as CreationAttributes<Model<TransferDetailAttributes>>;
        },
      );

      const details = await Promise.all(detailsPromises);

      const existingDetails = await this.transferDetailRepository.where(req, {
        transfer_pkid: pkid,
      });

      const existingDetailIds = existingDetails.map(
        (detail) => detail.get('pkid') as number,
      );
      const updatedDetailIds = details.map((detail) => detail.pkid as number);
      const detailsToDelete = existingDetailIds.filter(
        (id) => !updatedDetailIds.includes(id),
      );

      await this.transferDetailRepository.bulkUpdateWithTransaction(
        req,
        details.map((detail) => ({
          pkid: detail.pkid!,
          values: detail,
        })),
        transaction,
      );

      await this.transferDetailRepository.bulkDeleteWithTransaction(
        req,
        detailsToDelete,
        transaction,
      );

      // Update the total values in Transfer header within the same transaction
      existingTransfer.set({
        total_quantity: parseFloat(total_quantity.toFixed(4)),
        total_accepted_quantity: parseFloat(total_accepted_quantity.toFixed(4)),
        total_rejected_quantity: parseFloat(total_rejected_quantity.toFixed(4)),
      });

      await existingTransfer.save({ transaction });

      await transaction.commit();

      const updatedTransfer = await this.transferRepository.findByID(req, pkid);
      return await this.convertToResultDTO(updatedTransfer!);
    } catch (error) {
      if (transaction.finished !== 'commit') {
        await transaction.rollback();
      }
      this.handleError(req, error);
      throw error;
    }
  }
  //endregion

  //region Delete & Restore methods
  async softDeleteTransfer(req: Request, pkid: number): Promise<void> {
    await super.softDelete(req, pkid);
  }

  async hardDeleteTransfer(req: Request, pkid: number): Promise<void> {
    await this.transferRepository.hardDelete(req, pkid);
  }

  async restoreTransfer(req: Request, pkid: number): Promise<void> {
    await super.restore(req, pkid);
  }
  //endregion

  //region Generate CSV
  async generateCsvTransfer(req: Request): Promise<string> {
    try {
      const transfers = await this.transferRepository.findAllWithDetails(req);
      return await generateCSVTransfer(transfers);
    } catch (error) {
      throw new Error(getMessage(req, MessagesKey.ERRORGENERATECSV));
    }
  }
  //endregion
}

import { Request } from 'express';
import { BaseService } from '../common/base.service';
import {
  BomHeaderCreateVM,
  getAllAttributesVM,
  getAllAttributesForDetailVM,
  BomHeaderUpdateVM,
  mapToBomAvailabilityResultVM,
} from '../../helpers/view-models/bom.vm';
import {
  BomHeaderCreateDTO,
  BomHeaderResultDTO,
  BomHeaderDropdownDTO,
  getBomHeaderDropdownAttributes,
  BomDetailInputDTO,
  BomDetailResultDTO,
  BomAvailabilityResultDTO,
  BomAvailabilityDetailDTO,
} from '../../helpers/dto/bom.dto';
import { BomHeaderRepository } from '../../data-access/repositories/bomHeader.repository';
import { BomDetailRepository } from '../../data-access/repositories/bomDetail.repository';
import { BomHeaderAttributes } from '../../infrastructure/models/bomHeader.model';
import { BomDetailAttributes } from '../../infrastructure/models/bomDetail.model';
import {
  CreationAttributes,
  Model,
  Op,
  Transaction,
  WhereOptions,
} from 'sequelize';
import { generateCSVBom } from '../../helpers/utility/csv/generateCsvBom';
import db from '../../infrastructure/models';
import { formatMessage, getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { BomStatus } from '../../helpers/enum/bomStatus.enum';
import { ItemService } from './item.service';
import { CodeGenerator } from '../../helpers/utility/generateCode';
import { ItemWarehouseService } from './itemWarehouse.service';

export class BomService extends BaseService<Model<BomHeaderAttributes>> {
  private bomHeaderRepository: BomHeaderRepository;
  private bomDetailRepository: BomDetailRepository;
  private itemService: ItemService;
  private itemWarehouseService: ItemWarehouseService;

  constructor() {
    super(new BomHeaderRepository());
    this.bomHeaderRepository = new BomHeaderRepository();
    this.bomDetailRepository = new BomDetailRepository();
    this.itemService = new ItemService();
    this.itemWarehouseService = new ItemWarehouseService();
  }

  //region Helper methods
  private async convertToResultDTO(
    model: Model<BomHeaderAttributes>,
  ): Promise<BomHeaderResultDTO> {
    const bomHeader = model.toJSON() as BomHeaderAttributes;

    const details = await this.bomDetailRepository.where({} as Request, {
      bom_header_pkid: bomHeader.pkid,
    });
    const detailsDTO = await this.buildNestedDetails(details);

    const itemHeader = await this.itemService.findItemByID(
      {} as Request,
      bomHeader.item_header_pkid,
    );

    return getAllAttributesVM(bomHeader, detailsDTO, itemHeader || undefined);
  }

  private async buildNestedDetails(
    details: Model<BomDetailAttributes>[],
  ): Promise<BomDetailResultDTO[]> {
    const detailMap: { [key: number]: BomDetailResultDTO } = {};
    const rootDetails: BomDetailResultDTO[] = [];

    for (const detail of details) {
      const detailDTO = detail.toJSON() as BomDetailAttributes;
      const itemDTO = await this.itemService.findItemByID(
        {} as Request,
        detailDTO.item_detail_pkid,
      );

      const detailResult = getAllAttributesForDetailVM(
        detailDTO,
        itemDTO || undefined,
      );

      detailMap[detailResult.pkid] = detailResult;

      if (!detailResult.parent_bom_detail_pkid) {
        rootDetails.push(detailResult);
      }
    }

    for (const detailPkid in detailMap) {
      const detail = detailMap[detailPkid];
      if (detail.parent_bom_detail_pkid) {
        const parentDetail = detailMap[detail.parent_bom_detail_pkid];
        if (parentDetail) {
          parentDetail.childBomDetails = parentDetail.childBomDetails || [];
          parentDetail.childBomDetails.push(detail);
        }
      }
    }

    return rootDetails;
  }

  private async convertToDropdownDTO(
    model: Model<BomHeaderAttributes>,
  ): Promise<BomHeaderDropdownDTO> {
    const bomHeader = model.toJSON() as BomHeaderAttributes;
    return getBomHeaderDropdownAttributes(bomHeader);
  }

  private async calculateCostFromItem(
    itemPkid: number,
    quantity: number,
  ): Promise<number> {
    const item = await this.itemService.findItemByID({} as Request, itemPkid);
    if (!item) {
      throw new Error(getMessage({} as Request, MessagesKey.ITEMNOTFOUND));
    }

    const price = (item.purchase_price ?? item.selling_price) || 0;
    return price * quantity;
  }

  private async calculateTotalCost(
    bomDetails: BomDetailInputDTO[],
  ): Promise<number> {
    let totalCost = 0;
    for (const detail of bomDetails) {
      const cost = await this.calculateCostFromItem(
        detail.item_detail_pkid,
        detail.quantity,
      );
      totalCost += cost;

      if (detail.childBomDetails && detail.childBomDetails.length > 0) {
        totalCost += await this.calculateTotalCost(detail.childBomDetails);
      }
    }
    return totalCost;
  }

  //endregion

  //region Find methods
  async findAllBoms(req: Request): Promise<BomHeaderResultDTO[]> {
    const boms = await super.findAll(req);
    return await Promise.all(boms.map((bom) => this.convertToResultDTO(bom)));
  }

  async findBomByID(
    req: Request,
    pkid: number,
  ): Promise<BomHeaderResultDTO | null> {
    const bom = await super.findByPKID(req, pkid);
    if (bom) {
      return await this.convertToResultDTO(bom);
    }
    return null;
  }

  async findBomsByCriteria(
    req: Request,
    criteria: any,
  ): Promise<BomHeaderResultDTO[]> {
    const where: WhereOptions<BomHeaderAttributes> = {};
    if (criteria.code) where.code = criteria.code;

    const boms = await this.where(req, where);
    return await Promise.all(boms.map((bom) => this.convertToResultDTO(bom)));
  }

  async getBomsDropdown(req: Request): Promise<BomHeaderDropdownDTO[]> {
    const boms = await super.findAll(req);
    return await Promise.all(boms.map((bom) => this.convertToDropdownDTO(bom)));
  }

  async findAllBomHeaders(req: Request): Promise<BomHeaderResultDTO[]> {
    const boms = await this.bomHeaderRepository.findAllHeaders(req);
    return boms.map((bom) => getAllAttributesVM(bom, []));
  }

  public async getBomByItemEndProductPkid(
    req: Request,
    itemEndProductPkid: number,
  ): Promise<BomHeaderResultDTO | null> {
    const bom =
      await this.bomHeaderRepository.findByItemEndProductPkidAndActiveStatus(
        req,
        itemEndProductPkid,
      );

    if (!bom) {
      throw new Error(
        formatMessage(getMessage(req, MessagesKey.ACTIVEBOMNOTFOUND), [
          itemEndProductPkid.toString(),
        ]),
      );
    }

    const bomHeaderPkid = bom.get('pkid');

    if (typeof bomHeaderPkid !== 'number') {
      throw new Error(
        formatMessage(getMessage(req, MessagesKey.BOMITEMHEADERNOTFOUND), [
          itemEndProductPkid.toString(),
        ]),
      );
    }

    const bomDetails = await this.bomDetailRepository.where(req, {
      bom_header_pkid: bomHeaderPkid,
    });
    const itemHeader = await this.itemService.findItemByID(
      req,
      itemEndProductPkid,
    );
    const detailsDTO = await this.buildNestedDetails(bomDetails);

    return getAllAttributesVM(
      bom.toJSON(),
      detailsDTO,
      itemHeader || undefined,
    );
  }
  //endregion

  //region Create methods
  // Helper method to create BOM details recursively
  private async createDetails(
    req: Request,
    details: BomDetailInputDTO[],
    bomHeaderPkid: number,
    parentId: number | undefined = undefined,
    transaction: Transaction,
  ): Promise<void> {
    const detailMap = new Map<number, BomDetailInputDTO>();

    for (const detail of details) {
      if (detailMap.has(detail.item_detail_pkid)) continue;

      detailMap.set(detail.item_detail_pkid, detail);

      const cost = await this.calculateCostFromItem(
        detail.item_detail_pkid,
        detail.quantity,
      );

      const bomDetailData: CreationAttributes<BomDetailAttributes> = {
        bom_header_pkid: bomHeaderPkid,
        item_detail_pkid: detail.item_detail_pkid,
        quantity: detail.quantity,
        wastage_percentage: detail.wastage_percentage,
        cost: cost,
        level: detail.level ?? 0,
        notes: detail.notes ?? undefined,
        parent_bom_detail_pkid: parentId,
        unique_parent: detail.unique_parent ?? null,
        item_code: detail.item_code ?? null,
        created_by: 'system',
        created_date: new Date(),
        created_host: req.ip,
        is_deleted: false,
      };

      const createdDetail =
        await this.bomDetailRepository.createWithTransaction(
          req,
          bomDetailData as CreationAttributes<Model<BomDetailAttributes>>,
          transaction,
        );

      if (detail.childBomDetails && detail.childBomDetails.length > 0) {
        await this.createDetails(
          req,
          detail.childBomDetails,
          bomHeaderPkid,
          createdDetail.getDataValue('pkid'),
          transaction,
        );
      }
    }
  }

  // Create BOM method
  async createBom(
    req: Request,
    vm: BomHeaderCreateVM,
  ): Promise<BomHeaderResultDTO> {
    const generatedCode = await CodeGenerator.generateBomCode();

    const dto: BomHeaderCreateDTO = {
      ...vm.bomHeaderData,
      code: generatedCode,
      status: BomStatus.ACTIVE, // Set new BOM as active
    };

    const transaction = await db.sequelize.transaction();

    try {
      await this.bomHeaderRepository.setInactiveForSameItemHeader(
        req,
        dto.item_header_pkid,
        transaction,
      );

      const totalCost = await this.calculateTotalCost(dto.bomDetails);

      const bomHeaderData: Partial<BomHeaderAttributes> = {
        ...dto,
        total_cost: totalCost,
      };

      const createdBomHeader =
        await this.bomHeaderRepository.createWithTransaction(
          req,
          bomHeaderData as BomHeaderAttributes,
          transaction,
        );

      const bomHeaderPkid = createdBomHeader.getDataValue('pkid');

      await this.createDetails(
        req,
        dto.bomDetails,
        bomHeaderPkid as number,
        undefined,
        transaction,
      );

      await transaction.commit();

      return await this.convertToResultDTO(createdBomHeader);
    } catch (error) {
      await transaction.rollback();
      this.handleError(req, error);
      throw error;
    }
  }
  //endregion

  //region Update methods
  async updateBom(
    req: Request,
    pkid: number,
    vm: BomHeaderUpdateVM,
  ): Promise<BomHeaderResultDTO> {
    const allowedUpdates: Partial<BomHeaderAttributes> = {
      production_quantity: vm.bomHeaderData.production_quantity,
      description: vm.bomHeaderData.description,
      status: vm.bomHeaderData.status,
      effective_date: vm.bomHeaderData.effective_date,
      expiration_date: vm.bomHeaderData.expiration_date,
    };

    const transaction = await db.sequelize.transaction();

    try {
      const existingBom = await this.bomHeaderRepository.findByID(req, pkid);
      if (!existingBom) {
        throw new Error(getMessage(req, MessagesKey.ERRORUPDATE));
      }

      const bomDetails = vm.bomHeaderData.bomDetails || [];

      const totalCost = await this.calculateTotalCost(
        bomDetails.filter(
          (detail) => detail.item_detail_pkid !== undefined,
        ) as BomDetailInputDTO[],
      );

      // Check if status is being updated to active
      if (
        allowedUpdates.status === BomStatus.ACTIVE &&
        existingBom.get('status') !== BomStatus.ACTIVE
      ) {
        const itemHeaderPkid = existingBom.get('item_header_pkid');
        if (typeof itemHeaderPkid === 'number') {
          // Set all other BOMs with the same item_header_pkid to inactive
          await this.bomHeaderRepository.update(
            req,
            {
              item_header_pkid: itemHeaderPkid,
              pkid: { [Op.ne]: pkid }, // Exclude the current BOM
              status: BomStatus.ACTIVE,
            } as WhereOptions<BomHeaderAttributes>,
            {
              status: BomStatus.INACTIVE,
            },
            transaction,
          );
        } else {
          throw new Error('Invalid item_header_pkid');
        }
      }

      // Update BOM Header
      await this.bomHeaderRepository.update(
        req,
        pkid,
        {
          ...allowedUpdates,
          total_cost: totalCost,
        },
        transaction,
      );

      // Handle BOM Details
      const existingDetails = await this.bomDetailRepository.where(req, {
        bom_header_pkid: pkid,
      });

      const existingDetailIds = new Set(
        existingDetails.map((detail) => detail.get('pkid') as number),
      );

      const detailsToDelete = new Set(existingDetailIds);
      const detailsToUpdate: CreationAttributes<BomDetailAttributes>[] = [];
      const detailsToCreate: CreationAttributes<BomDetailAttributes>[] = [];

      // Recursive function to process updates for details and their children
      const processDetails = async (
        details: BomDetailInputDTO[],
        parentId?: number,
      ) => {
        for (const detail of details) {
          if (detail.item_detail_pkid === undefined) {
            throw new Error(getMessage(req, MessagesKey.REQUIREDITEMPKID));
          }

          const existingDetail = existingDetails.find(
            (d) => d.get('pkid') === detail.pkid,
          );

          const parentBomDetailPkid =
            detail.parent_bom_detail_pkid ??
            existingDetail?.get('parent_bom_detail_pkid');
          const uniqueParent =
            detail.unique_parent ?? existingDetail?.get('unique_parent');
          const itemCode = detail.item_code ?? existingDetail?.get('item_code');

          const cost = await this.calculateCostFromItem(
            detail.item_detail_pkid!,
            detail.quantity!,
          );

          if (detail.pkid && existingDetailIds.has(detail.pkid)) {
            detailsToUpdate.push({
              pkid: detail.pkid,
              quantity: detail.quantity!,
              wastage_percentage: detail.wastage_percentage,
              cost: cost,
              level: detail.level ?? 0,
              notes: detail.notes ?? undefined,
              parent_bom_detail_pkid: parentBomDetailPkid,
              unique_parent: uniqueParent,
              item_code: itemCode,
            } as CreationAttributes<BomDetailAttributes>);

            detailsToDelete.delete(detail.pkid!);
            existingDetailIds.delete(detail.pkid!);

            // Recursively process child BOM details
            if (detail.childBomDetails && detail.childBomDetails.length > 0) {
              await processDetails(detail.childBomDetails, detail.pkid);
            }
          } else {
            detailsToCreate.push({
              bom_header_pkid: pkid,
              item_detail_pkid: detail.item_detail_pkid,
              quantity: detail.quantity!,
              wastage_percentage: detail.wastage_percentage,
              cost: cost,
              level: detail.level ?? 0,
              notes: detail.notes ?? undefined,
              parent_bom_detail_pkid: parentBomDetailPkid,
              unique_parent: uniqueParent,
              item_code: itemCode,
              created_by: 'system',
              created_date: new Date(),
              created_host: req.ip,
              is_deleted: false,
            } as CreationAttributes<BomDetailAttributes>);

            // Recursively process child BOM details
            if (detail.childBomDetails && detail.childBomDetails.length > 0) {
              await processDetails(detail.childBomDetails, detail.pkid);
            }
          }
        }
      };

      await processDetails(bomDetails as BomDetailInputDTO[]);

      // Handle deletions
      if (detailsToUpdate.length > 0) {
        await this.bomDetailRepository.bulkUpdateWithTransaction(
          req,
          detailsToUpdate.map((detail) => ({
            pkid: detail.pkid!,
            values: detail,
          })),
          transaction,
        );
      }

      if (detailsToDelete.size > 0) {
        await this.bomDetailRepository.bulkDeleteWithTransaction(
          req,
          Array.from(detailsToDelete),
          transaction,
        );
      }

      if (detailsToCreate.length > 0) {
        await this.bomDetailRepository.bulkCreateWithTransaction(
          req,
          detailsToCreate as CreationAttributes<Model<BomDetailAttributes>>[],
          transaction,
        );
      }

      await transaction.commit();

      const updatedBom = await this.bomHeaderRepository.findByID(req, pkid);

      return await this.convertToResultDTO(updatedBom!);
    } catch (error) {
      await transaction.rollback();
      this.handleError(req, error);
      throw error;
    }
  }
  //endregion

  //region Delete & Restore methods
  async softDeleteBom(req: Request, pkid: number): Promise<void> {
    await super.softDelete(req, pkid);
  }

  async hardDeleteBom(req: Request, pkid: number): Promise<void> {
    await this.bomHeaderRepository.hardDelete(req, pkid);
  }

  async restoreBom(req: Request, pkid: number): Promise<void> {
    await super.restore(req, pkid);
  }
  //endregion

  //region Generate CSV
  async generateCsvBom(req: Request): Promise<string> {
    try {
      const boms = await this.bomHeaderRepository.findAllWithDetails(req);
      return await generateCSVBom(boms);
    } catch (error) {
      throw new Error(getMessage(req, MessagesKey.ERRORGENERATECSV));
    }
  }
  //endregion

  //region Calculate Cost
  public async getBomDataByItemHeaderAndQuantity(
    req: Request,
    data: { itemHeaderId: number; quantity: number }[],
  ): Promise<BomHeaderResultDTO[]> {
    const result: BomHeaderResultDTO[] = [];

    const itemHeaderPKIDs = data.map((entry) => entry.itemHeaderId);

    const bomHeaders = await this.bomHeaderRepository.findByItemHeaderPKIDs(
      req,
      itemHeaderPKIDs,
    );

    for (const entry of data) {
      const { itemHeaderId, quantity } = entry;

      const bomHeader = bomHeaders.find(
        (header) => header.get('item_header_pkid') === itemHeaderId,
      );

      if (!bomHeader) {
        throw new Error(
          formatMessage(getMessage(req, MessagesKey.BOMITEMHEADERNOTFOUND), [
            itemHeaderId.toString(),
          ]),
        );
      }

      const bomHeaderPkid = bomHeader.get('pkid') as number;

      const bomDetails = await this.bomDetailRepository.where(req, {
        bom_header_pkid: bomHeaderPkid,
      });

      const adjustedBomDetails = await this.adjustBomDetailsForQuantityLinear(
        bomDetails,
        quantity,
        bomHeader.get('production_quantity') as number,
      );

      const adjustedTotalCost = adjustedBomDetails.reduce(
        (sum, detail) => sum + (detail.cost || 0),
        0,
      );

      const adjustedBomHeader: Partial<BomHeaderAttributes> = {
        pkid: bomHeaderPkid,
        code: bomHeader.get('code') as string,
        item_header_pkid: bomHeader.get('item_header_pkid') as number,
        production_quantity: quantity,
        total_cost: adjustedTotalCost,
        description: bomHeader.get('description') as string | undefined,
        status: bomHeader.get('status') as BomStatus | undefined,
        effective_date: bomHeader.get('effective_date') as Date | undefined,
        expiration_date: bomHeader.get('expiration_date') as Date | undefined,
        unique_parent: bomHeader.get('unique_parent') as number | undefined,
        item_code: bomHeader.get('item_code') as string | undefined,
      };

      const resultDTO = getAllAttributesVM(
        adjustedBomHeader as BomHeaderAttributes,
      );
      resultDTO.bomDetails = adjustedBomDetails;

      result.push(resultDTO);
    }

    return result;
  }

  private async adjustBomDetailsForQuantityLinear(
    bomDetails: Model<BomDetailAttributes>[],
    newQuantity: number,
    originalQuantity: number,
  ): Promise<BomDetailResultDTO[]> {
    const adjustedDetails: BomDetailResultDTO[] = [];

    const flattenDetails = async (
      details: Model<BomDetailAttributes>[],
      parentDetailPkid?: number,
    ) => {
      for (const detail of details) {
        const detailDTO = detail.toJSON() as BomDetailAttributes;
        const adjustedQuantity =
          (detailDTO.quantity / originalQuantity) * newQuantity;
        const adjustedCost =
          ((detailDTO.cost || 0) / originalQuantity) * newQuantity;

        adjustedDetails.push(
          getAllAttributesForDetailVM({
            ...detailDTO,
            quantity: adjustedQuantity,
            cost: adjustedCost,
          } as BomDetailAttributes),
        );

        const childBomDetails = await this.bomDetailRepository.where(
          {} as Request,
          { parent_bom_detail_pkid: detailDTO.pkid },
        );

        if (childBomDetails.length > 0) {
          await flattenDetails(childBomDetails, detailDTO.pkid);
        }
      }
    };

    await flattenDetails(bomDetails);

    return adjustedDetails;
  }

  private async adjustBomDetailsForQuantity(
    bomDetails: Model<BomDetailAttributes>[],
    newQuantity: number,
    originalQuantity: number,
  ): Promise<BomDetailResultDTO[]> {
    const adjustedDetails: BomDetailResultDTO[] = [];

    for (const detail of bomDetails) {
      const detailDTO = detail.toJSON() as BomDetailAttributes;
      const adjustedQuantity =
        (detailDTO.quantity / originalQuantity) * newQuantity;
      const adjustedCost =
        ((detailDTO.cost || 0) / originalQuantity) * newQuantity;

      const childBomDetails = await this.bomDetailRepository.where(
        {} as Request,
        { parent_bom_detail_pkid: detailDTO.pkid },
      );

      const adjustedChildDetails = await this.adjustBomDetailsForQuantity(
        childBomDetails,
        newQuantity,
        originalQuantity,
      );

      adjustedDetails.push(
        getAllAttributesForDetailVM(
          {
            ...detailDTO,
            quantity: adjustedQuantity,
            cost: adjustedCost,
          } as BomDetailAttributes,
          undefined,
          adjustedChildDetails,
        ),
      );
    }

    return adjustedDetails;
  }
  //endregion

  //region Check methods
  public async checkRawMaterialsAvailability(
    req: Request,
    itemHeaderId: number,
    warehouseId: number,
    quantity: number,
  ): Promise<BomAvailabilityResultDTO> {
    const bomHeaders = await this.bomHeaderRepository.findByItemHeaderPKIDs(
      req,
      [itemHeaderId],
      BomStatus.ACTIVE,
    );

    if (!bomHeaders || bomHeaders.length === 0) {
      throw new Error(getMessage(req, MessagesKey.BOMITEMHEADERNOTFOUND));
    }

    const estimatedBomData = await this.getBomDataByItemHeaderAndQuantity(req, [
      { itemHeaderId, quantity },
    ]);

    if (!estimatedBomData || estimatedBomData.length === 0) {
      throw new Error(getMessage(req, MessagesKey.BOMITEMHEADERNOTFOUND));
    }

    const estimatedBomDetails = estimatedBomData[0].bomDetails || [];

    const itemMap = new Map<number, BomAvailabilityDetailDTO>();

    const checkAvailability = async (
      details: BomDetailResultDTO[],
      parentQuantity: number = 1,
    ): Promise<void> => {
      for (const detail of details) {
        const itemDetailPkid = detail.item_detail_pkid;
        const requiredQuantity = detail.quantity * parentQuantity;

        let isAvailable = false;
        let currentQuantity = 0;
        try {
          const itemWarehouseData =
            await this.itemWarehouseService.findItemWarehousesByCriteria(req, {
              item_pkid: itemDetailPkid,
              warehouse_pkid: warehouseId,
            });
          currentQuantity = itemWarehouseData[0]?.quantity || 0;
          isAvailable = currentQuantity >= requiredQuantity;
        } catch (error) {
          isAvailable = false;
        }

        const availabilityDetail: BomAvailabilityDetailDTO = {
          itemId: itemDetailPkid,
          statusQuantity: isAvailable,
          requiredQuantity: requiredQuantity,
          currentQuantity: currentQuantity,
          childBom: [],
          parentDetailPkid: detail.parent_bom_detail_pkid,
        };

        itemMap.set(detail.pkid, availabilityDetail);

        if (detail.childBomDetails && detail.childBomDetails.length > 0) {
          await checkAvailability(detail.childBomDetails, requiredQuantity);
        }
      }
    };

    await checkAvailability(estimatedBomDetails, quantity);

    // Build the tree structure
    const rootItems: BomAvailabilityDetailDTO[] = [];
    itemMap.forEach((item) => {
      if (
        item.parentDetailPkid === null ||
        item.parentDetailPkid === undefined
      ) {
        rootItems.push(item);
      } else {
        const parentItem = itemMap.get(item.parentDetailPkid);
        if (parentItem) {
          parentItem.childBom.push(item);
        }
      }
    });

    const endProductWarehouseData =
      await this.itemWarehouseService.findItemWarehousesByCriteria(req, {
        item_pkid: itemHeaderId,
        warehouse_pkid: warehouseId,
      });
    const endProductCurrentQuantity = endProductWarehouseData[0]?.quantity || 0;
    const endProductAvailable = endProductCurrentQuantity >= quantity;

    const availabilityResult: BomAvailabilityResultDTO = {
      endProduct: {
        itemId: itemHeaderId,
        statusQuantity: endProductAvailable,
        requiredQuantity: quantity,
        currentQuantity: endProductCurrentQuantity,
      },
      childItems: rootItems,
    };

    return mapToBomAvailabilityResultVM(availabilityResult);
  }

  //endregion
}

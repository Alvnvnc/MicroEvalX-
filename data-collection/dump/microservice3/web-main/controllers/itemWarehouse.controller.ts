import { Request, Response } from 'express';
import { ItemWarehouseService } from '../../business-layer/services/itemWarehouse.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import {
  ItemWarehouseCreateVM,
  ItemWarehouseUpdateVM,
} from '../../helpers/view-models/itemWarehouse.vm';

export class ItemWarehouseController extends BaseController {
  private itemWarehouseService: ItemWarehouseService;

  constructor() {
    super();
    this.itemWarehouseService = new ItemWarehouseService();
  }

  //region Find methods
  public async findAllItemWarehouses(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const itemWarehouses =
        await this.itemWarehouseService.findAllItemWarehouses(req);
      if (itemWarehouses.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          itemWarehouses,
          MessagesKey.SUCCESSGET,
          200,
        );
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async findItemWarehouseByID(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const itemWarehouse =
        await this.itemWarehouseService.findItemWarehouseByID(req, pkid);
      if (itemWarehouse) {
        return this.sendSuccessGet(
          req,
          res,
          itemWarehouse,
          MessagesKey.SUCCESSGETBYID,
          200,
        );
      } else {
        return this.sendErrorNotFound(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async findItemWarehousesByCriteria(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const criteria = req.query;
      const itemWarehouses =
        await this.itemWarehouseService.findItemWarehousesByCriteria(
          req,
          criteria,
        );
      if (itemWarehouses.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          itemWarehouses,
          MessagesKey.SUCCESSGET,
          200,
        );
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async findItemWarehousesByWarehouseID(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const warehouse_pkid = parseInt(req.params.warehouse_pkid);
      if (isNaN(warehouse_pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const itemWarehouses =
        await this.itemWarehouseService.findItemWarehousesByWarehouseID(
          req,
          warehouse_pkid,
        );
      if (itemWarehouses.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          itemWarehouses,
          MessagesKey.SUCCESSGET,
          200,
        );
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async checkItemQuantity(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const { item_pkid, warehouse_pkid, quantity } = req.body;

      if (isNaN(item_pkid) || isNaN(warehouse_pkid) || isNaN(quantity)) {
        return this.sendErrorBadRequest(req, res);
      }

      const isQuantitySufficient =
        await this.itemWarehouseService.checkItemQuantity(
          req,
          item_pkid,
          warehouse_pkid,
          quantity,
        );

      return res.status(200).json({
        success: true,
        status: isQuantitySufficient,
      });
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region Create methods
  public async createItemWarehouse(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const vm = new ItemWarehouseCreateVM(req.body);
      const resultDTO = await this.itemWarehouseService.createItemWarehouse(
        req,
        vm,
      );
      return this.sendSuccessCreate(req, res, resultDTO, resultDTO.pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region Update methods
  public async updateItemWarehouse(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const vm = new ItemWarehouseUpdateVM(req.body);
      const resultDTO = await this.itemWarehouseService.updateItemWarehouse(
        req,
        pkid,
        vm,
      );
      return this.sendSuccessUpdate(req, res, resultDTO, pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region Delete and Restore methods
  public async softDeleteItemWarehouse(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.itemWarehouseService.softDeleteItemWarehouse(req, pkid);
      return this.sendSuccessHardDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async hardDeleteItemWarehouse(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.itemWarehouseService.hardDeleteItemWarehouse(req, pkid);
      return this.sendSuccessHardDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async restoreItemWarehouse(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.itemWarehouseService.restoreItemWarehouse(req, pkid);
      return this.sendSuccessRestore(req, res, pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region CSV Methods
  public async generateCsv(req: Request, res: Response): Promise<void> {
    try {
      const csvContent =
        await this.itemWarehouseService.generateCsvItemWarehouse(req);

      res.setHeader(
        'Content-Disposition',
        'attachment; filename="itemWarehouse.csv"',
      );
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      res.status(200).send(csvContent);
    } catch (error) {
      this.handleErrorGenerateCsv(req, res, error);
    }
  }
  //endregion
}

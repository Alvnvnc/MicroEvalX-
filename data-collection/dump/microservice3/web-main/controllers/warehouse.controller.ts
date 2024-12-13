import { Request, Response } from 'express';
import { WarehouseService } from '../../business-layer/services/warehouse.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import {
  WarehouseCreateVM,
  WarehouseUpdateVM,
} from '../../helpers/view-models/warehouse.vm';

export class WarehouseController extends BaseController {
  private warehouseService: WarehouseService;

  constructor() {
    super();
    this.warehouseService = new WarehouseService();
  }

  //region Find methods
  public async findAllWarehouses(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const warehouses = await this.warehouseService.findAllWarehouses(req);
      if (warehouses.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          warehouses,
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

  public async findWarehouseByID(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const warehouse = await this.warehouseService.findWarehouseByID(
        req,
        pkid,
      );
      if (warehouse) {
        return this.sendSuccessGet(
          req,
          res,
          warehouse,
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

  public async findWarehousesByCriteria(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const criteria = req.query;
      const warehouses = await this.warehouseService.findWarehousesByCriteria(
        req,
        criteria,
      );
      if (warehouses.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          warehouses,
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

  public async findAllWarehousesForDropdown(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const warehouses =
        await this.warehouseService.findAllWarehousesForDropdown(req);
      return this.sendSuccessGet(
        req,
        res,
        warehouses,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region Create methods
  public async createWarehouse(req: Request, res: Response): Promise<Response> {
    try {
      const vm = new WarehouseCreateVM(req.body);
      const resultVM = await this.warehouseService.createWarehouse(req, vm);
      return this.sendSuccessCreate(
        req,
        res,
        resultVM.result,
        resultVM.result.pkid,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region Update methods
  public async updateWarehouse(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const vm = new WarehouseUpdateVM(req.body);
      const updateResult = await this.warehouseService.updateWarehouse(
        req,
        pkid,
        vm,
      );
      return this.sendSuccessUpdate(req, res, updateResult);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region Delete & Restore methods
  public async softDeleteWarehouse(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.warehouseService.softDeleteWarehouse(req, pkid);
      return this.sendSuccessSoftDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async hardDeleteWarehouse(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.warehouseService.hardDeleteWarehouse(req, pkid);
      return this.sendSuccessHardDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async restoreWarehouse(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.warehouseService.restoreWarehouse(req, pkid);
      return this.sendSuccessRestore(req, res, pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region CSV Methods
  public async generateCsv(req: Request, res: Response): Promise<void> {
    try {
      const csvContent = await this.warehouseService.generateCsvWarehouse(req);

      res.setHeader(
        'Content-Disposition',
        'attachment; filename="warehouse.csv"',
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

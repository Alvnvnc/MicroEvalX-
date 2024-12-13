
import { Request, Response } from 'express';
import { ItemWarehouseService } from '../../business-layer/services/itemWarehouse.service';
import { BaseController } from '../common/base.controller';

export class ItemWarehouseDeleteRestoreController extends BaseController {
  private itemWarehouseService: ItemWarehouseService;

  constructor() {
    super();
    this.itemWarehouseService = new ItemWarehouseService();
  }

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
}
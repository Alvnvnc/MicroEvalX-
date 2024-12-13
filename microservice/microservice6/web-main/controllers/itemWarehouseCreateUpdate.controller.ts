
import { Request, Response } from 'express';
import { ItemWarehouseService } from '../../business-layer/services/itemWarehouse.service';
import { BaseController } from '../common/base.controller';
import { ItemWarehouseCreateVM, ItemWarehouseUpdateVM } from '../../helpers/view-models/itemWarehouse.vm';

export class ItemWarehouseCreateUpdateController extends BaseController {
  private itemWarehouseService: ItemWarehouseService;

  constructor() {
    super();
    this.itemWarehouseService = new ItemWarehouseService();
  }

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
}

import { Request, Response } from 'express';
import { ItemWarehouseService } from '../../business-layer/services/itemWarehouse.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class ItemWarehouseFindController extends BaseController {
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
}
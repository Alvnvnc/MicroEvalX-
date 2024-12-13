// controllers/items/basic-item.controller.ts
import { Request, Response } from 'express';
import { BasicItemService } from '../../../business-layer/services/items/basic-item.service';
import { BaseController } from '../../common/base.controller';
import { MessagesKey } from '../../../helpers/messages/messagesKey';
import { ItemCreateVM, ItemUpdateVM } from '../../../helpers/view-models/item.vm';

export class BasicItemController extends BaseController {
  private basicItemService: BasicItemService;

  constructor() {
    super();
    this.basicItemService = new BasicItemService();
  }

  //region Find methods
  public async findAllItems(req: Request, res: Response): Promise<Response> {
    try {
      const items = await this.basicItemService.findAllItems(req);
      if (items.length > 0) {
        return this.sendSuccessGet(req, res, items, MessagesKey.SUCCESSGET, 200);
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async findItemByID(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const item = await this.basicItemService.findItemByID(req, pkid);
      if (item) {
        return this.sendSuccessGet(req, res, item, MessagesKey.SUCCESSGETBYID, 200);
      } else {
        return this.sendErrorNotFound(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async findItemsByCriteria(req: Request, res: Response): Promise<Response> {
    try {
      const criteria = req.query;
      const items = await this.basicItemService.findItemsByCriteria(req, criteria);
      if (items.length > 0) {
        return this.sendSuccessGet(req, res, items, MessagesKey.SUCCESSGET, 200);
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  //region Create methods
  public async createItem(req: Request, res: Response): Promise<Response> {
    try {
      const vm = new ItemCreateVM(req.body);
      const resultDTO = await this.basicItemService.createItem(req, vm);
      return this.sendSuccessCreate(req, res, resultDTO, resultDTO.pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region Update methods
  public async updateItem(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const vm = new ItemUpdateVM(req.body);
      const resultDTO = await this.basicItemService.updateItem(req, pkid, vm);
      return this.sendSuccessUpdate(req, res, resultDTO, pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region Delete and Restore methods
  public async softDeleteItem(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.basicItemService.softDeleteItem(req, pkid);
      return this.sendSuccessHardDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async hardDeleteItem(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.basicItemService.hardDeleteItem(req, pkid);
      return this.sendSuccessHardDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async restoreItem(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.basicItemService.restoreItem(req, pkid);
      return this.sendSuccessRestore(req, res, pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region CSV Methods
  public async generateCsv(req: Request, res: Response): Promise<void> {
    try {
      const csvContent = await this.basicItemService.generateCsvItem(req);

      res.setHeader('Content-Disposition', 'attachment; filename="items.csv"');
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

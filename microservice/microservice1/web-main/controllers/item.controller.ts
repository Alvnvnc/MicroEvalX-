import { Request, Response } from 'express';
import { ItemService } from '../../business-layer/services/item.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { ItemCreateVM, ItemUpdateVM } from '../../helpers/view-models/item.vm';

export class ItemController extends BaseController {
  private itemService: ItemService;

  constructor() {
    super();
    this.itemService = new ItemService();
  }

  //region Find methods
  public async findAllItems(req: Request, res: Response): Promise<Response> {
    try {
      const items = await this.itemService.findAllItems(req);
      if (items.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          items,
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

  public async findItemByID(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const item = await this.itemService.findItemByID(req, pkid);
      if (item) {
        return this.sendSuccessGet(
          req,
          res,
          item,
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

  public async findItemsByCriteria(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const criteria = req.query;
      const items = await this.itemService.findItemsByCriteria(req, criteria);
      if (items.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          items,
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

  public async findItemsByCategory(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const itemCategoryPkid = parseInt(req.params.itemCategoryPkid);
      if (isNaN(itemCategoryPkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const items = await this.itemService.findItemsByCategory(
        req,
        itemCategoryPkid,
      );
      if (items.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          items,
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

  public async findAllItemsForDropdown(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const items = await this.itemService.findAllItemsForDropdown(req);
      return this.sendSuccessGet(req, res, items, MessagesKey.SUCCESSGET, 200);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async findItemsForDropdownByCategory(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const itemCategoryPkid = parseInt(req.params.itemCategoryPkid);
      if (isNaN(itemCategoryPkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const items = await this.itemService.findItemsForDropdownByCategory(
        req,
        itemCategoryPkid,
      );
      return this.sendSuccessGet(req, res, items, MessagesKey.SUCCESSGET, 200);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region Create methods
  public async createItem(req: Request, res: Response): Promise<Response> {
    try {
      const vm = new ItemCreateVM(req.body);
      const resultDTO = await this.itemService.createItem(req, vm);
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
      const resultDTO = await this.itemService.updateItem(req, pkid, vm);
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
      await this.itemService.softDeleteItem(req, pkid);
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
      await this.itemService.hardDeleteItem(req, pkid);
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
      await this.itemService.restoreItem(req, pkid);
      return this.sendSuccessRestore(req, res, pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region CSV Methods
  public async generateCsv(req: Request, res: Response): Promise<void> {
    try {
      const csvContent = await this.itemService.generateCsvItem(req);

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

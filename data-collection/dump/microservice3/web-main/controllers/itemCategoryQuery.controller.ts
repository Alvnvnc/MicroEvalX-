// itemCategoryQuery.controller.ts
import { Request, Response } from 'express';
import { ItemCategoryQueryService } from '../../business-layer/services/itemCategoryQuery.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class ItemCategoryQueryController extends BaseController {
  private itemCategoryQueryService: ItemCategoryQueryService;

  constructor() {
    super();
    this.itemCategoryQueryService = new ItemCategoryQueryService();
  }

  public async findAllItemCategories(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const itemCategories = await this.itemCategoryQueryService.findAllItemCategories(req);
      if (itemCategories.length > 0) {
        return this.sendSuccessGet(req, res, itemCategories, MessagesKey.SUCCESSGET, 200);
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async findItemCategoryByID(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const itemCategory = await this.itemCategoryQueryService.findItemCategoryByID(req, pkid);
      if (itemCategory) {
        return this.sendSuccessGet(req, res, itemCategory, MessagesKey.SUCCESSGETBYID, 200);
      } else {
        return this.sendErrorNotFound(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async findItemCategoriesByCriteria(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const criteria = req.query;
      const itemCategories = await this.itemCategoryQueryService.findItemCategoriesByCriteria(req, criteria);
      if (itemCategories.length > 0) {
        return this.sendSuccessGet(req, res, itemCategories, MessagesKey.SUCCESSGET, 200);
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async findAllItemCategoriesForDropdown(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const itemCategories = await this.itemCategoryQueryService.findAllItemCategoriesForDropdown(req);
      if (itemCategories.length > 0) {
        return this.sendSuccessGet(req, res, itemCategories, MessagesKey.SUCCESSGET, 200);
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}

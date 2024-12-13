import { Request, Response } from 'express';
import { ItemCategoryService } from '../../business-layer/services/itemCategory.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class ItemCategoryController extends BaseController {
  private itemCategoryService: ItemCategoryService;

  constructor() {
    super();
    this.itemCategoryService = new ItemCategoryService();
  }

  //region Find methods
  public async findAllItemCategories(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const itemCategories =
        await this.itemCategoryService.findAllItemCategories(req);
      if (itemCategories.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          itemCategories,
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

  public async findItemCategoryByID(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const itemCategory = await this.itemCategoryService.findItemCategoryByID(
        req,
        pkid,
      );
      if (itemCategory) {
        return this.sendSuccessGet(
          req,
          res,
          itemCategory,
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

  public async findItemCategoriesByCriteria(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const criteria = req.query;
      const itemCategories =
        await this.itemCategoryService.findItemCategoriesByCriteria(
          req,
          criteria,
        );
      if (itemCategories.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          itemCategories,
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

  public async findAllItemCategoriesForDropdown(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const itemCategories =
        await this.itemCategoryService.findAllItemCategoriesForDropdown(req);
      if (itemCategories.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          itemCategories,
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
  //endregion

  //region CSV Methods
  public async generateCsv(req: Request, res: Response): Promise<void> {
    try {
      const csvContent =
        await this.itemCategoryService.generateCsvItemCategory(req);

      res.setHeader(
        'Content-Disposition',
        'attachment; filename="itemCategories.csv"',
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

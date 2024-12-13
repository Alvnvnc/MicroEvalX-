
// controllers/items/category-unit.controller.ts
import { Request, Response } from 'express';
import { CategoryUnitService } from '../../../business-layer/services/items/category-unit.service';
import { BaseController } from '../../common/base.controller';
import { MessagesKey } from '../../../helpers/messages/messagesKey';

export class CategoryUnitController extends BaseController {
  private categoryUnitService: CategoryUnitService;

  constructor() {
    super();
    this.categoryUnitService = new CategoryUnitService();
  }

  //region Category methods
  public async findItemsByCategory(req: Request, res: Response): Promise<Response> {
    try {
      const itemCategoryPkid = parseInt(req.params.itemCategoryPkid);
      if (isNaN(itemCategoryPkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const category = await this.categoryUnitService.findItemCategoryByID(req, itemCategoryPkid);
      if (category) {
        return this.sendSuccessGet(req, res, category, MessagesKey.SUCCESSGET, 200);
      } else {
        return this.sendErrorNotFound(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async findAllCategories(req: Request, res: Response): Promise<Response> {
    try {
      const categories = await this.categoryUnitService.findAllItemCategories(req);
      if (categories.length > 0) {
        return this.sendSuccessGet(req, res, categories, MessagesKey.SUCCESSGET, 200);
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getItemCategoriesDropdown(req: Request, res: Response): Promise<Response> {
    try {
      const categories = await this.categoryUnitService.getItemCategoriesDropdown(req);
      return this.sendSuccessGet(req, res, categories, MessagesKey.SUCCESSGET, 200);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region Unit methods
  public async findItemsForDropdownByCategory(req: Request, res: Response): Promise<Response> {
    try {
      const itemCategoryPkid = parseInt(req.params.itemCategoryPkid);
      if (isNaN(itemCategoryPkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const items = await this.categoryUnitService.getUnitsDropdown(req);
      return this.sendSuccessGet(req, res, items, MessagesKey.SUCCESSGET, 200);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async findAllUnits(req: Request, res: Response): Promise<Response> {
    try {
      const units = await this.categoryUnitService.findAllUnits(req);
      if (units.length > 0) {
        return this.sendSuccessGet(req, res, units, MessagesKey.SUCCESSGET, 200);
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getUnitsDropdown(req: Request, res: Response): Promise<Response> {
    try {
      const units = await this.categoryUnitService.getUnitsDropdown(req);
      return this.sendSuccessGet(req, res, units, MessagesKey.SUCCESSGET, 200);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion
}
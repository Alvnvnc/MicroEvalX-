import { Request, Response } from 'express';
import { BomService } from '../../business-layer/services/bom.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import {
  BomHeaderCreateVM,
  BomHeaderUpdateVM,
} from '../../helpers/view-models/bom.vm';

export class BomController extends BaseController {
  private bomService: BomService;

  constructor() {
    super();
    this.bomService = new BomService();
  }

  //region Find methods
  public async findAllBoms(req: Request, res: Response): Promise<Response> {
    try {
      const boms = await this.bomService.findAllBoms(req);
      if (boms.length > 0) {
        return this.sendSuccessGet(req, res, boms, MessagesKey.SUCCESSGET);
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async findBomByID(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const bom = await this.bomService.findBomByID(req, pkid);
      if (bom) {
        return this.sendSuccessGet(req, res, bom, MessagesKey.SUCCESSGETBYID);
      } else {
        return this.sendErrorNotFound(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async findBomsByCriteria(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const criteria = req.query;
      const boms = await this.bomService.findBomsByCriteria(req, criteria);
      if (boms.length > 0) {
        return this.sendSuccessGet(req, res, boms, MessagesKey.SUCCESSGET);
      } else {
        return this.sendErrorNotFound(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async getBomsDropdown(req: Request, res: Response): Promise<Response> {
    try {
      const dropdownData = await this.bomService.getBomsDropdown(req);
      if (dropdownData.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          dropdownData,
          MessagesKey.SUCCESSGET,
        );
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async findAllBomHeaders(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const boms = await this.bomService.findAllBomHeaders(req);
      if (boms.length > 0) {
        return this.sendSuccessGet(req, res, boms, MessagesKey.SUCCESSGET);
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async getBomByItemEndProductPkid(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const itemEndProductPkid = parseInt(req.params.itemEndProductPkid);
      if (isNaN(itemEndProductPkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const bom = await this.bomService.getBomByItemEndProductPkid(
        req,
        itemEndProductPkid,
      );
      if (bom) {
        return this.sendSuccessGet(req, res, bom, MessagesKey.SUCCESSGET);
      } else {
        return this.sendErrorNotFound(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }
  //endregion

  //region Create methods
  public async createBom(req: Request, res: Response): Promise<Response> {
    try {
      const vm = new BomHeaderCreateVM(req.body);
      const resultVM = await this.bomService.createBom(req, vm);
      return this.sendSuccessCreate(req, res, resultVM);
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }
  //endregion

  //region Update methods
  public async updateBom(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const vm = new BomHeaderUpdateVM(req.body);
      const updateResult = await this.bomService.updateBom(req, pkid, vm);
      return this.sendSuccessUpdate(req, res, updateResult);
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }
  //endregion

  //region Delete & Restore methods
  public async softDeleteBom(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.bomService.softDeleteBom(req, pkid);
      return this.sendSuccessSoftDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async hardDeleteBom(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.bomService.hardDeleteBom(req, pkid);
      return this.sendSuccessHardDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async restoreBom(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.bomService.restoreBom(req, pkid);
      return this.sendSuccessRestore(req, res, pkid);
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }
  //endregion

  //region Generate CSV
  public async generateCsv(req: Request, res: Response): Promise<void> {
    try {
      const csvContent = await this.bomService.generateCsvBom(req);

      res.setHeader('Content-Disposition', 'attachment; filename="bom.csv"');
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

  //region Calculate methods
  public async getBomDataByItemHeaderAndQuantity(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      // Adjusting the type to match the expected format
      const data = req.body as { itemHeaderId: number; quantity: number }[];
      const result = await this.bomService.getBomDataByItemHeaderAndQuantity(
        req,
        data,
      );
      return this.sendSuccessGet(req, res, result, MessagesKey.SUCCESSGET);
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }
  //endregion

  //region Check methods
  public async checkRawMaterialsAvailability(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const { itemHeaderId, warehouseId, quantity } = req.body;

      if (isNaN(itemHeaderId) || isNaN(warehouseId) || isNaN(quantity)) {
        return this.sendErrorBadRequest(req, res);
      }

      const availabilityResult =
        await this.bomService.checkRawMaterialsAvailability(
          req,
          itemHeaderId,
          warehouseId,
          quantity,
        );

      return this.sendSuccessGet(
        req,
        res,
        availabilityResult,
        MessagesKey.SUCCESSGET,
      );
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }
  //endregion
}

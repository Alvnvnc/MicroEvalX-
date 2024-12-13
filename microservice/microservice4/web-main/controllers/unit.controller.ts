import { Request, Response } from 'express';
import { UnitService } from '../../business-layer/services/unit.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { UnitCreateVM, UnitUpdateVM } from '../../helpers/view-models/unit.vm';

export class UnitController extends BaseController {
  private unitService: UnitService;

  constructor() {
    super();
    this.unitService = new UnitService();
  }

  //region Find methods
  public async findAllUnits(req: Request, res: Response): Promise<Response> {
    try {
      const units = await this.unitService.findAllUnits(req);
      if (units.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          units,
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

  public async findUnitByID(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const unit = await this.unitService.findUnitByID(req, pkid);
      if (unit) {
        return this.sendSuccessGet(
          req,
          res,
          unit,
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

  public async findUnitsByCriteria(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const criteria = req.query;
      const units = await this.unitService.findUnitsByCriteria(req, criteria);
      if (units.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          units,
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

  public async findAllUnitsForDropdown(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const units = await this.unitService.findAllUnitsForDropdown(req);
      return this.sendSuccessGet(req, res, units, MessagesKey.SUCCESSGET, 200);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region Create methods
  public async createUnit(req: Request, res: Response): Promise<Response> {
    try {
      const vm = new UnitCreateVM(req.body);
      const resultVM = await this.unitService.createUnit(req, vm);
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
  public async updateUnit(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const vm = new UnitUpdateVM(req.body);
      const updateResult = await this.unitService.updateUnit(req, pkid, vm);
      return this.sendSuccessUpdate(req, res, updateResult);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region Delete & Restore methods
  public async softDeleteUnit(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.unitService.softDeleteUnit(req, pkid);
      return this.sendSuccessSoftDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async hardDeleteUnit(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.unitService.hardDeleteUnit(req, pkid);
      return this.sendSuccessHardDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async restoreUnit(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.unitService.restoreUnit(req, pkid);
      return this.sendSuccessRestore(req, res, pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
  //endregion

  //region CSV Methods
  public async generateCsv(req: Request, res: Response): Promise<void> {
    try {
      const csvContent = await this.unitService.generateCsvUnit(req);

      res.setHeader('Content-Disposition', 'attachment; filename="unit.csv"');
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

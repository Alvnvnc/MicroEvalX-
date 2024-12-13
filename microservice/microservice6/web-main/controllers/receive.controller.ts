import { Request, Response } from 'express';
import { ReceiveService } from '../../business-layer/services/receive.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import {
  ReceiveCreateVM,
  ReceiveUpdateVM,
} from '../../helpers/view-models/receive.vm';

export class ReceiveController extends BaseController {
  private receiveService: ReceiveService;

  constructor() {
    super();
    this.receiveService = new ReceiveService();
  }

  //region Find methods
  public async findAllReceives(req: Request, res: Response): Promise<Response> {
    try {
      const receives = await this.receiveService.findAllReceives(req);
      if (receives.length > 0) {
        return this.sendSuccessGet(req, res, receives, MessagesKey.SUCCESSGET);
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async findReceiveByID(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const receive = await this.receiveService.findReceiveByID(req, pkid);
      if (receive) {
        return this.sendSuccessGet(
          req,
          res,
          receive,
          MessagesKey.SUCCESSGETBYID,
        );
      } else {
        return this.sendErrorNotFound(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async findReceivesByCriteria(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const criteria = req.query;
      const receives = await this.receiveService.findReceivesByCriteria(
        req,
        criteria,
      );
      if (receives.length > 0) {
        return this.sendSuccessGet(req, res, receives, MessagesKey.SUCCESSGET);
      } else {
        return this.sendErrorNotFound(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async getReceivesDropdown(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const dropdownData = await this.receiveService.getReceivesDropdown(req);
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

  public async findAllReceiveHeaders(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const receives = await this.receiveService.findAllReceiveHeaders(req);
      if (receives.length > 0) {
        return this.sendSuccessGet(req, res, receives, MessagesKey.SUCCESSGET);
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }
  //endregion

  //region Create methods
  public async createReceive(req: Request, res: Response): Promise<Response> {
    try {
      const vm = new ReceiveCreateVM(req.body);
      const resultVM = await this.receiveService.createReceive(req, vm);
      return this.sendSuccessCreate(req, res, resultVM);
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }
  //endregion

  //region Update methods
  public async updateReceive(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const vm = new ReceiveUpdateVM(req.body);
      const updateResult = await this.receiveService.updateReceive(
        req,
        pkid,
        vm,
      );
      return this.sendSuccessUpdate(req, res, updateResult);
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }
  //endregion

  //region Delete & Restore methods
  public async softDeleteReceive(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.receiveService.softDeleteReceive(req, pkid);
      return this.sendSuccessSoftDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async hardDeleteReceive(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.receiveService.hardDeleteReceive(req, pkid);
      return this.sendSuccessHardDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async restoreReceive(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.receiveService.restoreReceive(req, pkid);
      return this.sendSuccessRestore(req, res, pkid);
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }
  //endregion

  //region Generate CSV
  public async generateCsv(req: Request, res: Response): Promise<void> {
    try {
      const csvContent = await this.receiveService.generateCsvReceive(req);

      res.setHeader(
        'Content-Disposition',
        'attachment; filename="receive.csv"',
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

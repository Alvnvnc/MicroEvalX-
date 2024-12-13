import { Request, Response } from 'express';
import { TransferService } from '../../business-layer/services/transfer.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import {
  TransferCreateVM,
  TransferUpdateVM,
} from '../../helpers/view-models/transfer.vm';

export class TransferController extends BaseController {
  private transferService: TransferService;

  constructor() {
    super();
    this.transferService = new TransferService();
  }

  //region Find methods
  public async findAllTransfers(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const transfers = await this.transferService.findAllTransfers(req);
      if (transfers.length > 0) {
        return this.sendSuccessGet(req, res, transfers, MessagesKey.SUCCESSGET);
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async findTransferByID(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const transfer = await this.transferService.findTransferByID(req, pkid);
      if (transfer) {
        return this.sendSuccessGet(
          req,
          res,
          transfer,
          MessagesKey.SUCCESSGETBYID,
        );
      } else {
        return this.sendErrorNotFound(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async findTransfersByCriteria(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const criteria = req.query;
      const transfers = await this.transferService.findTransfersByCriteria(
        req,
        criteria,
      );
      if (transfers.length > 0) {
        return this.sendSuccessGet(req, res, transfers, MessagesKey.SUCCESSGET);
      } else {
        return this.sendErrorNotFound(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async getTransfersDropdown(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const dropdownData = await this.transferService.getTransfersDropdown(req);
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

  public async findAllTransferHeaders(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const transfers = await this.transferService.findAllTransferHeaders(req);
      if (transfers.length > 0) {
        return this.sendSuccessGet(req, res, transfers, MessagesKey.SUCCESSGET);
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }
  //endregion

  //region Create methods
  public async createTransfer(req: Request, res: Response): Promise<Response> {
    try {
      const vm = new TransferCreateVM(req.body);
      const resultVM = await this.transferService.createTransfer(req, vm);
      return this.sendSuccessCreate(req, res, resultVM);
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }
  //endregion

  //region Update methods
  public async updateTransfer(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const vm = new TransferUpdateVM(req.body);
      const updateResult = await this.transferService.updateTransfer(
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
  public async softDeleteTransfer(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.transferService.softDeleteTransfer(req, pkid);
      return this.sendSuccessSoftDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async hardDeleteTransfer(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.transferService.hardDeleteTransfer(req, pkid);
      return this.sendSuccessHardDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }

  public async restoreTransfer(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.transferService.restoreTransfer(req, pkid);
      return this.sendSuccessRestore(req, res, pkid);
    } catch (error) {
      return this.handleError(req, res, error);
    }
  }
  //endregion

  //region Generate CSV
  public async generateCsv(req: Request, res: Response): Promise<void> {
    try {
      const csvContent = await this.transferService.generateCsvTransfer(req);

      res.setHeader(
        'Content-Disposition',
        'attachment; filename="transfer.csv"',
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

// itemCategoryExport.controller.ts
import { Request, Response } from 'express';
import { ItemCategoryExportService } from '../../business-layer/services/itemCategoryExport.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class ItemCategoryExportController extends BaseController {
  private itemCategoryExportService: ItemCategoryExportService;

  constructor() {
    super();
    this.itemCategoryExportService = new ItemCategoryExportService();
  }

  public async generateCsv(req: Request, res: Response): Promise<void> {
    try {
      const csvContent = await this.itemCategoryExportService.generateCsvItemCategory(req);

      res.setHeader('Content-Disposition', 'attachment; filename="itemCategories.csv"');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      res.status(200).send(csvContent);
    } catch (error) {
      this.handleErrorGenerateCsv(req, res, error);
    }
  }
}

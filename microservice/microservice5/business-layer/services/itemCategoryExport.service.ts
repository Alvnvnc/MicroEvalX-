// itemCategoryExport.service.ts
import { Request } from 'express';
import { generateCSVItemCategory } from '../../helpers/utility/csv/generateCsvItemCategory';
import { getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class ItemCategoryExportService {
    async generateCsvItemCategory(
        req: Request,
        itemCategoryIds?: number[],
    ): Promise<string> {
        try {
            return await generateCSVItemCategory(req, itemCategoryIds);
        } catch (error) {
            throw new Error(getMessage(req, MessagesKey.ERRORGENERATECSV));
        }
    }
}

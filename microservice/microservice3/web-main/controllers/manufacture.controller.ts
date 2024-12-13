// import { ManufactureService } from "../../business-layer/services/manufacture.service";
// import { Request, Response } from 'express';
// import { BaseController } from '../common/base.controller';
// import { MessagesKey } from '../../helpers/messages/messagesKey';
//
// export class ManufactureController extends BaseController{
//     private manufactureService: ManufactureService;
//
//     constructor() {
//         super();
//         this.manufactureService = new ManufactureService();
//     }
//
//     public async getRawMaterialAvailability(req: Request, res: Response): Promise<Response> {
//         try {
//             const rawMaterialStatus = await this.manufactureService.getRawMaterialAvailability(req, req.body.item_id, req.body.quantity);
//             return this.sendSuccessGet(req, res, rawMaterialStatus, MessagesKey.SUCCESSGET);
//         } catch (error) {
//             return this.handleError(req, res, error, 500);
//         }
//     }
//     public async getBuyNeededRawMaterialList(req: Request, res: Response): Promise<Response> {
//         try {
//             const rawMaterialStatus = await this.manufactureService.getBuyNeededRawMaterialList(req, req.body.item_id, req.body.quantity);
//             return this.sendSuccessGet(req, res, rawMaterialStatus, MessagesKey.SUCCESSGET);
//         } catch (error) {
//             return this.handleError(req, res, error, 500);
//         }
//     }
// }

// import { Request, Response } from 'express';
// import { BaseController } from '../common/base.controller';
// import { MessagesKey } from '../../helpers/messages/messagesKey';
// import { DelayedProductionService } from '../../business-layer/services/delayedProduction.service';
//
// export class DelayedProductionController extends BaseController {
//     private delayedProductionService: DelayedProductionService;
//
//     constructor() {
//         super();
//         this.delayedProductionService = new DelayedProductionService();
//     }
//
//     // READ REGIONS
//     /**
//      * Handles request to get all delayed productions.
//      */
//     public async findAllDelayedProduction(req: Request, res: Response): Promise<Response> {
//         try {
//             const delayedProductions = await this.delayedProductionService.findAll(req);
//             return this.sendSuccessGet(req, res, delayedProductions, MessagesKey.SUCCESSGET);
//         } catch (error) {
//             return this.handleError(req, res, error, 500);
//         }
//     }
//
//     // CREATE REGIONS
//     /**
//      * Handles request to create a new delayed production.
//      */
//     public async createDelayedProduction(req: Request, res: Response): Promise<Response> {
//         try {
//             const data = req.body;
//             const delayedProduction = await this.delayedProductionService.createDelayedProduction(req, data);
//             return this.sendSuccessGet(req, res, delayedProduction, MessagesKey.SUCCESSCREATE, 201);
//         } catch (error) {
//             return this.handleError(req, res, error, 500);
//         }
//     }
//
//     // UPDATE REGIONS
//     /**
//      * Handles request to update delayed production status.
//      */
//     public async updateStatus(req: Request, res: Response): Promise<Response> {
//         try {
//             const pkid = parseInt(req.params.pkid);
//             if (isNaN(pkid)) {
//                 return this.sendErrorNotFound(req, res);
//             }
//             const result = await this.delayedProductionService.updateStatus(req, pkid);
//             return this.sendSuccessUpdate(req, res, result, MessagesKey.SUCCESSUPDATE);
//         } catch (error) {
//             return this.handleError(req, res, error, 500);
//         }
//     }
// }

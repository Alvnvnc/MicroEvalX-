// import { Request, Response } from 'express';
// import { BaseController } from '../common/base.controller';
// import { MessagesKey } from '../../helpers/messages/messagesKey';
//
// import { InventoryService } from "../../business-layer/services/inventory.service";
//
// export class InventoryController extends BaseController{
//     public inventoryService: InventoryService;
//
//     constructor() {
//         super();
//         this.inventoryService = new InventoryService();
//     }
//
//     /**
//      * receive items in inventory
//      */
//     async receiveItems(req: Request, res: Response): Promise<Response> {
//         try {
//             const purchase_id = req.body.purchase_id;
//             const response = await this.inventoryService.receiveItems(req, purchase_id);
//             return this.sendSuccessGet(req, res, response, MessagesKey.SUCCESSGET);
//         } catch (error) {
//             return this.handleError(req, res, error, 500);
//         }
//     }
//
//     /**
//      * get all items in inventory sum quantity
//      */
//     async getAllItemInventoryGroupByItemCodeAndSumQuantity(req: Request, res: Response): Promise<Response> {
//         try {
//             const response = await this.inventoryService.getAllItemInventoryGroupByItemCodeAndSumQuantity(req);
//             return this.sendSuccessGet(req, res, response, MessagesKey.SUCCESSGET);
//         } catch (error) {
//             return this.handleError(req, res, error, 500);
//         }
//     }
//     /**
//      * get all sum quantity by inventory id
//      * @param inventory_id id of inventory location.
//      */
//     async getAllItemPerInventoryIdGroupByItemCodeAndSumQuantity(req: Request, res: Response): Promise<Response> {
//         try {
//             const inventory_id = req.params.inventory_id;
//             const response = await this.inventoryService.getAllItemPerInventoryIdGroupByItemCodeAndSumQuantity(req, inventory_id as unknown as number);
//             return this.sendSuccessGet(req, res, response, MessagesKey.SUCCESSGET);
//         } catch (error) {
//             return this.handleError(req, res, error, 500);
//         }
//     }
//     /**
//      * get all inventory location
//      */
//     async getAllInventoryLocation(req: Request, res: Response): Promise<Response> {
//         try {
//             const response = await this.inventoryService.getAllInventoryLocation(req);
//             return this.sendSuccessGet(req, res, response, MessagesKey.SUCCESSGET);
//         } catch (error) {
//             return this.handleError(req, res, error, 500);
//         }
//     }
//     /**
//      * get clean sum quantity by item code
//      * @param item_code code of item.
//      */
//     async getCleanInventoryQuantityByItemCode(req: Request, res: Response): Promise<Response> {
//         try {
//             const item_code = req.params.item_code;
//             const response = await this.inventoryService.getCleanInventoryQuantityByItemCode(req, item_code);
//             return this.sendSuccessGet(req, res, response, MessagesKey.SUCCESSGET);
//         } catch (error) {
//             return this.handleError(req, res, error, 500);
//         }
//     }
// }

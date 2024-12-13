// import { BomService } from "./bom.service";
// import { BomListItemDTO, ChildItemDTO } from "../../helpers/dto/bom.dto";
// import { InventoryRepository } from "../../data-access/repositories/inventory.repository";
// import { InventoryService } from "./inventory.service";
//
// import {formatMessage, getMessage} from "../../helpers/messages/messagesUtil";
// import {MessagesKey} from "../../helpers/messages/messagesKey";
// import {BaseService} from '../common/base.service';
// import {Model, WhereOptions } from 'sequelize';
// import { Request } from "express";
//
// export class ManufactureService{
//     public bomService: BomService;
//     public inventoryRepository: InventoryRepository;
//     public inventoryService: InventoryService;
//
//     constructor() {
//         this.bomService = new BomService();
//         this.inventoryRepository = new InventoryRepository();
//         this.inventoryService = new InventoryService();
//     }
//
//     /**
//      * get raw material availability
//      * @param parent_item_code parent item code
//      * @param quantity_needed quantity needed
//      * return raw material status
//      */
//     async getRawMaterialAvailability(req: Request, parent_item_code: string, quantity_needed: number): Promise<any>{
//         try{
//             const bomList = await this.bomService.getRawMaterialListByParentItemCode(req, parent_item_code, quantity_needed, new BomListItemDTO());
//             if(bomList){
//                 for(let i=0; i<bomList.length; i++){
//                     //get clean inventory quantity by item code
//                     const cleanInventory = await this.inventoryService.getCleanInventoryQuantityByItemCode(req, bomList[i].code_item);
//                     if(!cleanInventory.availability){
//                         return {
//                             availability: false,
//                             status: `Bahan baku: ${bomList[i].code_item} - ${bomList[i].name_item} tidak mencukupi`,
//                             item_code: bomList[i].code_item,
//                         };
//                     }
//                 }
//             }
//             return {
//                 availability: true,
//                 status: 'Available'
//             };
//         }
//         catch(error){
//             console.log(error);
//             if(error instanceof Error){
//                 throw new Error('Error get raw material availability: ' + error.message);
//             }
//             throw error;
//         }
//     }
//     /**
//      * get buy needed raw material list
//      * @param parent_item_code parent item code
//      * @param quantity_needed quantity needed
//      */
//     async getBuyNeededRawMaterialList(req: Request, parent_item_code: string, quantity_needed: number): Promise<ChildItemDTO[]>{
//         try{
//             const bomList = await this.bomService.getRawMaterialListByParentItemCode(req, parent_item_code, quantity_needed, new BomListItemDTO());
//             if(bomList){
//                 const buyNeededListData = [] as ChildItemDTO[];
//                 for(let i=0; i<bomList.length; i++){
//                     //get clean inventory quantity by item code
//                     const cleanInventory = await this.inventoryService.getCleanInventoryQuantityByItemCode(req, bomList[i].code_item);
//                     if(!cleanInventory.availability){
//                         buyNeededListData.push(bomList[i]);
//                     }
//                 }
//                 return buyNeededListData;
//             }
//             else{
//                 return [];
//             }
//         }
//         catch(error){
//             console.log(error);
//             if(error instanceof Error){
//                 throw new Error('Error get buy needed raw mat: ' + error.message);
//             }
//             throw error;
//         }
//     }
// }

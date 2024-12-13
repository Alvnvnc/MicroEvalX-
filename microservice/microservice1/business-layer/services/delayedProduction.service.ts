// import { DelayedProductionRepository } from "../../data-access/repositories/delayedProduction.repository";
// import { DelayedProductionDTO, NewDelayedProductionDTO } from "../../helpers/dto/delayedProduction.dto";
// import { DelayedProductionAttributes } from "../../infrastructure/models/delayedProduction.model";
// import { ManufactureService } from "./manufacture.service";
// import { updateProductionRequest } from "../../data-access/integrations/manufacturing.integration";
//
// import {formatMessage, getMessage} from "../../helpers/messages/messagesUtil";
// import {MessagesKey} from "../../helpers/messages/messagesKey";
// import {BaseService} from '../common/base.service';
// import {Model, WhereOptions } from 'sequelize';
// import { Request } from "express";
//
// // export class DelayedProductionService{
// //     private delayedProductionRepository: DelayedProductionRepository;
// //     private manufactureService: ManufactureService;
//
// //     constructor(){
// //         this.delayedProductionRepository = new DelayedProductionRepository();
// //         this.manufactureService = new ManufactureService();
// //     }
//
// //     async findAll(): Promise<DelayedProductionDTO[]> {
// //         try {
// //             const delayedProduction = await this.delayedProductionRepository.findAll();
// //             const returnDelayedProduction: DelayedProductionDTO[] = [];
// //             for(const item of delayedProduction) {
// //                 if(!item.Item) throw new Error('Item not found');
// //                 const itemAvailability = await this.manufactureService.getRawMaterialAvailability(item.Item.code, item.quantity);
// //                 let raw_mat_status = false;
// //                 itemAvailability.availability ? raw_mat_status = true : raw_mat_status = false;
// //                 const delayedData: DelayedProductionDTO = {
// //                     pkid: item.pkid as unknown as number,
// //                     pdr_id: item.pdr_id,
// //                     item_id: item.Item.code,
// //                     quantity: item.quantity,
// //                     status: item.status,
// //                     raw_mat_status: raw_mat_status,
// //                     Item: item.Item,
// //                     createdAt: item.createdAt as unknown as string,
// //                 }
// //                 returnDelayedProduction.push(delayedData);
// //             }
// //             return returnDelayedProduction;
// //         } catch (error) {
// //             if (error instanceof Error) {
// //                 throw new Error('Error get delayed production: ' + error.message);
// //             }
// //             throw error;
// //         }
// //     }
//
// //     async createDelayedProduction(data: NewDelayedProductionDTO): Promise<DelayedProduction> {
// //         try {
// //             return await this.delayedProductionRepository.create(data);
// //         } catch (error) {
// //             if (error instanceof Error) {
// //                 throw new Error('Error create delayed production: ' + error.message);
// //             }
// //             throw error;
// //         }
// //     }
//
// //     async updateStatus(pkid: number): Promise<any> {
// //         try {
// //             const findDelayedProduction = await this.delayedProductionRepository.findByPk(pkid);
// //             if(!findDelayedProduction) throw new Error('Delayed production not found');
// //             const pdr_id = findDelayedProduction.pdr_id;
// //             const data_update = {
// //                 pr_status: 'On Progress'
// //             }
// //             await updateProductionRequest(pdr_id, data_update);
// //             return await this.delayedProductionRepository.updateStatus(pkid);
// //         } catch (error) {
// //             if (error instanceof Error) {
// //                 throw new Error('Error update status: ' + error.message);
// //             }
// //             throw error;
// //         }
// //     }
// // }
//
// export class DelayedProductionService extends BaseService<Model<DelayedProductionAttributes>> {
//     private manufactureService: ManufactureService;
//     private delayedProductionRepository: DelayedProductionRepository;
//
//     constructor() {
//         super(new DelayedProductionRepository());
//         this.manufactureService = new ManufactureService();
//         this.delayedProductionRepository = new DelayedProductionRepository();
//     }
//
//     async findAllDelayedProduction(req: Request): Promise<DelayedProductionDTO[]> {
//         try {
//             const delayedProduction = await super.findAll(req);
//             const returnDelayedProduction: DelayedProductionDTO[] = [];
//             for(const item of delayedProduction) {
//                 if(!item.dataValues.Item) throw new Error('Item not found');
//                 const itemAvailability = await this.manufactureService.getRawMaterialAvailability(req, item.dataValues.Item.code, item.dataValues.quantity);
//                 let raw_mat_status = false;
//                 itemAvailability.availability ? raw_mat_status = true : raw_mat_status = false;
//                 const delayedData: DelayedProductionDTO = {
//                     pkid: item.dataValues.pkid as unknown as number,
//                     pdr_id: item.dataValues.pdr_id,
//                     item_id: item.dataValues.Item.code,
//                     quantity: item.dataValues.quantity,
//                     status: item.dataValues.status,
//                     raw_mat_status: raw_mat_status,
//                     Item: item.dataValues.Item,
//                     createdAt: item.dataValues.createdAt as unknown as string,
//                 }
//                 returnDelayedProduction.push(delayedData);
//             }
//             return returnDelayedProduction;
//         } catch (error) {
//             this.handleError(req, error);
//         }
//     }
//
//     async createDelayedProduction(req: Request, data: NewDelayedProductionDTO): Promise<Model<DelayedProductionAttributes>> {
//         try {
//             return await super.create(req, data) as Model<DelayedProductionAttributes>;
//         } catch (error) {
//             this.handleError(req, error);
//         }
//     }
//
//     async updateStatus(req: Request, pkid: number): Promise<any> {
//         try {
//             const findDelayedProduction = await super.findByPKID(req, pkid);
//             if(!findDelayedProduction) throw new Error('Delayed production not found');
//             const pdr_id = findDelayedProduction.dataValues.pdr_id;
//             const data_update = {
//                 pr_status: 'On Progress'
//             }
//             await updateProductionRequest(pdr_id, data_update);
//             return await this.delayedProductionRepository.updateStatus(req, pkid);
//         } catch (error) {
//             this.handleError(req, error);
//         }
//     }
// }

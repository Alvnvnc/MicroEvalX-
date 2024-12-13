import { Request } from 'express';
import { DelayedProductionRepository } from '../../data-access/repositories/delayedProduction.repository';
import { DelayedProductionDTO, NewDelayedProductionDTO } from '../../helpers/dto/delayedProduction.dto';
import { DelayedProductionAttributes } from '../../infrastructure/models/delayedProduction.model';
import { ManufactureService } from './manufacture.service';
import { updateProductionRequest } from '../../data-access/integrations/manufacturing.integration';

import { formatMessage, getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { BaseService } from '../common/base.service';
import { Model } from 'sequelize';
import { ProductionStatus } from '../../helpers/enum/productionStatus.enum';

export class DelayedProductionService extends BaseService<Model<DelayedProductionAttributes>> {
    private manufactureService: ManufactureService;
    private delayedProductionRepository: DelayedProductionRepository;

    constructor() {
        super(new DelayedProductionRepository());
        this.manufactureService = new ManufactureService();
        this.delayedProductionRepository = new DelayedProductionRepository();
    }

    // Fetch all delayed production records with raw material availability
    async findAllDelayedProduction(req: Request): Promise<DelayedProductionDTO[]> {
        try {
            const delayedProductions = await this.delayedProductionRepository.findAll(req);
            const result: DelayedProductionDTO[] = [];

            for (const item of delayedProductions) {
                if (!item.dataValues.Item) {
                    throw new Error('Item not found');
                }

                const itemAvailability = await this.manufactureService.getRawMaterialAvailability(
                    req,
                    item.dataValues.Item.code,
                    item.dataValues.quantity
                );

                const delayedData: DelayedProductionDTO = {
                    pkid: item.dataValues.pkid,
                    pdr_id: item.dataValues.pdr_id,
                    item_id: item.dataValues.Item.code,
                    quantity: item.dataValues.quantity,
                    status: item.dataValues.status,
                    raw_mat_status: itemAvailability.availability || false,
                    Item: item.dataValues.Item,
                    createdAt: item.dataValues.created_date?.toString() || '', // Use optional chaining with a fallback
                };
                result.push(delayedData);
            }
            return result;
        } catch (error) {
            this.handleError(req, error);
        }
    }

    // Create a new delayed production record
    async createDelayedProduction(
        req: Request,
        data: NewDelayedProductionDTO
    ): Promise<Model<DelayedProductionAttributes>> {
        try {
            // Ensure status is of type ProductionStatus
            const delayedProductionData: Partial<DelayedProductionAttributes> = {
                ...data,
                status: data.status as ProductionStatus, // Cast status to ProductionStatus
            };

            return await this.delayedProductionRepository.create(req, delayedProductionData as DelayedProductionAttributes) as Model<DelayedProductionAttributes>;
        } catch (error) {
            this.handleError(req, error);
        }
    }

    // Update the status of a delayed production record
    async updateStatus(req: Request, pkid: number): Promise<any> {
        try {
            const delayedProduction = await this.delayedProductionRepository.findByPKID(req, pkid);
            if (!delayedProduction) {
                throw new Error('Delayed production not found');
            }

            const pdr_id = delayedProduction?.dataValues?.pdr_id; // Optional chaining for safety
            const dataUpdate = { pr_status: 'On Progress' };

            await updateProductionRequest(pdr_id, dataUpdate);
            return await this.delayedProductionRepository.updateStatus(req, pkid);
        } catch (error) {
            this.handleError(req, error);
        }
    }
}

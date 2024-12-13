import { Request } from 'express';
import { ItemCategoryQueryRepository } from '../../data-access/repositories/itemCategoryQuery.repository';
import { ItemCategoryAttributes } from '../../infrastructure/models/itemCategory.model';
import { ItemCategoryTransformationService } from './itemCategoryTransformation.service';
import { WhereOptions, Model } from 'sequelize';

export class ItemCategoryQueryService {
    private queryRepository: ItemCategoryQueryRepository;
    private transformationService: ItemCategoryTransformationService;

    constructor() {
        this.queryRepository = new ItemCategoryQueryRepository();
        this.transformationService = new ItemCategoryTransformationService();
    }

    async findAllItemCategories(req: Request) {
        const itemCategories = await this.queryRepository.findAll(req);
        return await Promise.all(
            itemCategories.map((item: Model<ItemCategoryAttributes>) =>
                this.transformationService.convertToResultDTO(item),
            ),
        );
    }

    async findItemCategoryByID(req: Request, pkid: number) {
        const itemCategory = await this.queryRepository.findByID(req, pkid);
        if (itemCategory) {
            return await this.transformationService.convertToResultDTO(itemCategory);
        }
        return null;
    }

    async findItemCategoriesByCriteria(
        req: Request,
        { code, name }: { code?: string; name?: string },
    ) {
        const criteria: WhereOptions<ItemCategoryAttributes> = {};
        if (code) criteria.code = code;
        if (name) criteria.name = name;

        const itemCategories = await this.queryRepository.where(req, criteria);
        return await Promise.all(
            itemCategories.map((item: Model<ItemCategoryAttributes>) =>
                this.transformationService.convertToResultDTO(item),
            ),
        );
    }

    async findAllItemCategoriesForDropdown(req: Request) {
        const itemCategories = await this.queryRepository.findAll(req);
        return await Promise.all(
            itemCategories.map((item: Model<ItemCategoryAttributes>) =>
                this.transformationService.convertToDropdownDTO(item),
            ),
        );
    }
}

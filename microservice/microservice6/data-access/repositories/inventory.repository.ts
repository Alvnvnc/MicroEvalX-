import { Model, Op, WhereOptions } from 'sequelize';
import { BaseRepository } from '../common/base.repository';
import { InventoryModel } from '../models/inventory.model';

export class InventoryRepository extends BaseRepository<InventoryModel> {
    constructor() {
        super(InventoryModel);
    }

    async findByItemCode(itemCode: string): Promise<InventoryModel | null> {
        return await this.model.findOne({
            where: { item_code: itemCode }
        });
    }

    async updateQuantity(pkid: number, quantity: number): Promise<[number, InventoryModel[]]> {
        return await this.model.update(
            { quantity },
            { where: { pkid }, returning: true }
        );
    }

    async findAvailableStock(itemCode: string): Promise<number> {
        const inventory = await this.findByItemCode(itemCode);
        return inventory ? inventory.quantity : 0;
    }

    async decreaseStock(itemCode: string, quantity: number): Promise<boolean> {
        const inventory = await this.findByItemCode(itemCode);
        if (!inventory || inventory.quantity < quantity) {
            return false;
        }
        
        await this.updateQuantity(inventory.pkid, inventory.quantity - quantity);
        return true;
    }

    async increaseStock(itemCode: string, quantity: number): Promise<boolean> {
        const inventory = await this.findByItemCode(itemCode);
        if (!inventory) {
            return false;
        }
        
        await this.updateQuantity(inventory.pkid, inventory.quantity + quantity);
        return true;
    }
}
import { Op } from 'sequelize';
import db from '../../infrastructure/models';

const itemCategoryPrefixes: Record<number, string> = {
  1: 'IEP',
  2: 'IRM',
  3: 'IMG',
  4: 'IMD',
  5: 'IOS',
  6: 'ISP',
  7: 'ICO',
};

export class CodeGenerator {
  static async getLastCode(modelName: string, prefix: string) {
    const model = db[modelName];
    const lastRecord = await model.findOne({
      where: {
        code: {
          [Op.like]: `${prefix}%`,
        },
      },
      order: [['code', 'DESC']],
    });
    return lastRecord?.code ?? null;
  }

  static generateSequentialCode(
    lastCode: string | null,
    prefix: string,
    length: number,
  ) {
    let nextSequence = 1;

    if (lastCode && lastCode.startsWith(prefix)) {
      const lastSequence = parseInt(lastCode.slice(prefix.length), 10);
      nextSequence = lastSequence + 1;
    }

    return `${prefix}${nextSequence.toString().padStart(length, '0')}`;
  }

  static async generateWarehouseCode() {
    const prefix = 'WH';
    const length = 5;
    const lastCode = await this.getLastCode('Warehouse', prefix);
    return this.generateSequentialCode(lastCode, prefix, length);
  }

  static async generateItemCode(itemCategoryPkid: number) {
    const prefix = itemCategoryPrefixes[itemCategoryPkid];
    if (!prefix) {
      throw new Error(`Invalid item category pkid: ${itemCategoryPkid}`);
    }
    const length = 8;
    const lastCode = await this.getLastCode('Item', prefix);
    return this.generateSequentialCode(lastCode, prefix, length);
  }

  static async generateReceiveCode() {
    const prefix = 'REC';
    const length = 8;
    const lastCode = await this.getLastCode('Receive', prefix);
    return this.generateSequentialCode(lastCode, prefix, length);
  }

  static async generateTransferCode() {
    const prefix = 'TRF';
    const length = 8;
    const lastCode = await this.getLastCode('Transfer', prefix);
    return this.generateSequentialCode(lastCode, prefix, length);
  }

  static async generateBomCode() {
    const prefix = 'BOM';
    const length = 8;
    const lastCode = await this.getLastCode('BomHeader', prefix);
    return this.generateSequentialCode(lastCode, prefix, length);
  }
}

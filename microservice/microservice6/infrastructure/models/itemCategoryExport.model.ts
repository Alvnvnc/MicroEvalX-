// itemCategoryExport.model.ts
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { ItemCategoryAttributes } from './itemCategory.model';

interface ItemCategoryCreationAttributes extends Optional<ItemCategoryAttributes, 'pkid'> {}

export class ItemCategoryExportModel
  extends Model<ItemCategoryAttributes, ItemCategoryCreationAttributes>
  implements ItemCategoryAttributes
{
  pkid!: number;
  code!: string;
  name!: string;
  status!: boolean;

  static initModel(sequelize: Sequelize) {
    ItemCategoryExportModel.init(
      {
        pkid: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        _attributes: '',
        sequelize: '',
        destroy: '',
        restore: '',
        update: '',
        increment: '',
        decrement: '',
        addHook: '',
        removeHook: '',
        hasHook: '',
        hasHooks: '',
        dataValues: '',
        _creationAttributes: '',
        isNewRecord: '',
        where: '',
        getDataValue: '',
        setDataValue: '',
        get: '',
        set: '',
        setAttributes: '',
        changed: '',
        previous: '',
        save: '',
        reload: '',
        validate: '',
        equals: '',
        equalsOneOf: '',
        toJSON: '',
        isSoftDeleted: '',
        _model: ''
      },
      {
        sequelize,
        modelName: 'ItemCategoryExport',
        tableName: 'item_categories',
        timestamps: false,
      }
    );
  }
}

// itemCategoryTransformation.model.ts
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { ItemCategoryAttributes } from './itemCategory.model';

interface ItemCategoryCreationAttributes extends Optional<ItemCategoryAttributes, 'pkid'> {}

export class ItemCategoryTransformationModel
  extends Model<ItemCategoryAttributes, ItemCategoryCreationAttributes>
  implements ItemCategoryAttributes
{
  pkid!: number;
  code!: string;
  coa_pkid?: number;
  name!: string;
  description?: string;
  status!: boolean;

  static initModel(sequelize: Sequelize) {
    ItemCategoryTransformationModel.init(
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
        coa_pkid: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
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
        modelName: 'ItemCategoryTransformation',
        tableName: 'item_categories',
        timestamps: false,
      }
    );
  }
}

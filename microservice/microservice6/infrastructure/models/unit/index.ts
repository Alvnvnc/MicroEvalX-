import { UnitAttributes } from './unitAttributes.model';
import { UnitModel } from './unit.model';
import { associate } from './unit.associations';

module.exports = (sequelize: any, DataTypes: any) => {
  const Unit = UnitModel(sequelize, DataTypes);
  associate(Unit, sequelize.models);
  return Unit;
};

export { UnitAttributes };
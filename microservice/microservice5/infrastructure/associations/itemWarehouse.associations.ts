
module.exports = (models: any) => {
  const { ItemWarehouse } = models;

  ItemWarehouse.belongsTo(models.Item, {
    foreignKey: 'item_pkid',
    as: 'item',
  });

  ItemWarehouse.belongsTo(models.Warehouse, {
    foreignKey: 'warehouse_pkid',
    as: 'warehouse',
  });
};
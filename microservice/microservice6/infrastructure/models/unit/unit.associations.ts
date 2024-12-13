export const associate = (Unit: any, models: any) => {
  Unit.hasMany(models.Item, {
    foreignKey: 'unit_pkid',
    as: 'items',
  });

  // Add other associations here if needed
};
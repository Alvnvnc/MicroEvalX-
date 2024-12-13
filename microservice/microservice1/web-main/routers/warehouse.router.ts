import { Router } from 'express';
import { WarehouseController } from '../controllers/warehouse.controller';

const router = Router();
const warehouseController = new WarehouseController();

//region Other methods
router.get('/generateCsv', (req, res) =>
  warehouseController.generateCsv(req, res),
);
//endregion

//region Find methods
router.get('/dropdown', (req, res) =>
  warehouseController.findAllWarehousesForDropdown(req, res),
);
router.get('/', (req, res) => warehouseController.findAllWarehouses(req, res));
router.get('/:pkid', (req, res) =>
  warehouseController.findWarehouseByID(req, res),
);
router.get('/search', (req, res) =>
  warehouseController.findWarehousesByCriteria(req, res),
);
//endregion

//region Create methods
router.post('/', (req, res) => warehouseController.createWarehouse(req, res));
//endregion

//region Update methods
router.put('/:pkid', (req, res) =>
  warehouseController.updateWarehouse(req, res),
);
//endregion

//region Delete & Restore methods
router.delete('/soft/:pkid', (req, res) =>
  warehouseController.softDeleteWarehouse(req, res),
);
router.delete('/hard/:pkid', (req, res) =>
  warehouseController.hardDeleteWarehouse(req, res),
);
router.put('/restore/:pkid', (req, res) =>
  warehouseController.restoreWarehouse(req, res),
);
//endregion

export default router;

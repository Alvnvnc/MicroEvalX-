import { Router } from 'express';
import { ItemWarehouseController } from '../controllers/itemWarehouse.controller';

const router = Router();
const itemWarehouseController = new ItemWarehouseController();

//region Other methods
router.get('/generateCsv', (req, res) =>
  itemWarehouseController.generateCsv(req, res),
);
//endregion

//region Find methods
router.get('/', (req, res) =>
  itemWarehouseController.findAllItemWarehouses(req, res),
);
router.get('/:pkid', (req, res) =>
  itemWarehouseController.findItemWarehouseByID(req, res),
);
router.get('/search', (req, res) =>
  itemWarehouseController.findItemWarehousesByCriteria(req, res),
);
router.get('/warehouse/:warehouse_pkid', (req, res) =>
  itemWarehouseController.findItemWarehousesByWarehouseID(req, res),
);
router.post('/check-quantity', (req, res) =>
  itemWarehouseController.checkItemQuantity(req, res),
);
//endregion

//region Create methods
router.post('/', (req, res) =>
  itemWarehouseController.createItemWarehouse(req, res),
);
//endregion

//region Update methods
router.put('/:pkid', (req, res) =>
  itemWarehouseController.updateItemWarehouse(req, res),
);
//endregion

//region Delete & Restore methods
router.delete('/soft/:pkid', (req, res) =>
  itemWarehouseController.softDeleteItemWarehouse(req, res),
);
router.delete('/hard/:pkid', (req, res) =>
  itemWarehouseController.hardDeleteItemWarehouse(req, res),
);
router.put('/restore/:pkid', (req, res) =>
  itemWarehouseController.restoreItemWarehouse(req, res),
);
//endregion

export default router;

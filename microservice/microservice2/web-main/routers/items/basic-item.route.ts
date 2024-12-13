// routes/items/basic-item.route.ts
import { Router } from 'express';
import { BasicItemController } from '../../controllers/items/basic-item.controller';

const router = Router();
const basicItemController = new BasicItemController();

//region Other methods
router.get('/generateCsv', (req, res) => 
  basicItemController.generateCsv(req, res)
);
//endregion

//region Find methods
router.get('/', (req, res) => 
  basicItemController.findAllItems(req, res)
);

router.get('/search', (req, res) =>
  basicItemController.findItemsByCriteria(req, res)
);

router.get('/:pkid', (req, res) => 
  basicItemController.findItemByID(req, res)
);
//endregion

//region Create methods
router.post('/', (req, res) => 
  basicItemController.createItem(req, res)
);
//endregion

//region Update methods
router.put('/:pkid', (req, res) => 
  basicItemController.updateItem(req, res)
);
//endregion

//region Delete & Restore methods
router.delete('/soft/:pkid', (req, res) =>
  basicItemController.softDeleteItem(req, res)
);

router.delete('/hard/:pkid', (req, res) =>
  basicItemController.hardDeleteItem(req, res)
);

router.put('/restore/:pkid', (req, res) =>
  basicItemController.restoreItem(req, res)
);
//endregion

export default router;
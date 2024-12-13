import { Router } from 'express';
import { ItemController } from '../controllers/item.controller';

const router = Router();
const itemController = new ItemController();

//region Other methods
router.get('/generateCsv', (req, res) => itemController.generateCsv(req, res));
//endregion

//region Find methods
router.get('/dropdown', (req, res) =>
  itemController.findAllItemsForDropdown(req, res),
);
router.get('/dropdown/category/:itemCategoryPkid', (req, res) =>
  itemController.findItemsForDropdownByCategory(req, res),
);
router.get('/', (req, res) => itemController.findAllItems(req, res));
router.get('/:pkid', (req, res) => itemController.findItemByID(req, res));
router.get('/search', (req, res) =>
  itemController.findItemsByCriteria(req, res),
);
router.get('/category/:itemCategoryPkid', (req, res) =>
  itemController.findItemsByCategory(req, res),
);
//endregion

//region Create methods
router.post('/', (req, res) => itemController.createItem(req, res));
//endregion

//region Update methods
router.put('/:pkid', (req, res) => itemController.updateItem(req, res));
//endregion

//region Delete & Restore methods
router.delete('/soft/:pkid', (req, res) =>
  itemController.softDeleteItem(req, res),
);
router.delete('/hard/:pkid', (req, res) =>
  itemController.hardDeleteItem(req, res),
);
router.put('/restore/:pkid', (req, res) =>
  itemController.restoreItem(req, res),
);
//endregion

export default router;

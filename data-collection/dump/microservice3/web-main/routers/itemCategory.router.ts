import { Router } from 'express';
import { ItemCategoryController } from '../controllers/itemCategory.controller';

const router = Router();
const itemCategoryController = new ItemCategoryController();

//region Other methods
router.get('/generateCsv', (req, res) =>
  itemCategoryController.generateCsv(req, res),
);
//endregion

//region Find methods
router.get('/dropdown', (req, res) =>
  itemCategoryController.findAllItemCategoriesForDropdown(req, res),
);
router.get('/search', (req, res) =>
  itemCategoryController.findItemCategoriesByCriteria(req, res),
);
router.get('/', (req, res) =>
  itemCategoryController.findAllItemCategories(req, res),
);
router.get('/:pkid', (req, res) =>
  itemCategoryController.findItemCategoryByID(req, res),
);
//endregion

export default router;

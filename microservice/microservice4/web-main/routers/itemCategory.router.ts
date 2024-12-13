import { Router } from 'express';
import { ItemCategoryQueryController } from '../controllers/itemCategoryQuery.controller';
import { ItemCategoryExportController } from '../controllers/itemCategoryExport.controller';

const router = Router();
const itemCategoryQueryController = new ItemCategoryQueryController();
const itemCategoryExportController = new ItemCategoryExportController();

//region Export methods
router.get('/generateCsv', (req, res) =>
  itemCategoryExportController.generateCsv(req, res),
);
//endregion

//region Find methods
router.get('/dropdown', (req, res) =>
  itemCategoryQueryController.findAllItemCategoriesForDropdown(req, res),
);
router.get('/search', (req, res) =>
  itemCategoryQueryController.findItemCategoriesByCriteria(req, res),
);
router.get('/', (req, res) =>
  itemCategoryQueryController.findAllItemCategories(req, res),
);
router.get('/:pkid', (req, res) =>
  itemCategoryQueryController.findItemCategoryByID(req, res),
);
//endregion

export default router;


// routes/items/category-unit.route.ts
import { Router } from 'express';
import { CategoryUnitController } from '../../controllers/items/category-unit.controller';

const router = Router();
const categoryUnitController = new CategoryUnitController();

//region Category routes
router.get('/', (req, res) => 
  categoryUnitController.findAllCategories(req, res)
);

router.get('/dropdown', (req, res) =>
  categoryUnitController.getItemCategoriesDropdown(req, res)
);

router.get('/:itemCategoryPkid', (req, res) =>
  categoryUnitController.findItemsByCategory(req, res)
);
//endregion

//region Unit routes
router.get('/units', (req, res) => 
  categoryUnitController.findAllUnits(req, res)
);

router.get('/units/dropdown', (req, res) =>
  categoryUnitController.getUnitsDropdown(req, res)
);

router.get('/units/:itemCategoryPkid', (req, res) =>
  categoryUnitController.findItemsForDropdownByCategory(req, res)
);
//endregion

export default router;
import { Router } from 'express';
import { UnitController } from '../controllers/unit.controller';

const router = Router();
const unitController = new UnitController();

//region Other methods
router.get('/generateCsv', (req, res) => unitController.generateCsv(req, res));
//endregion

//region Find methods
router.get('/dropdown', (req, res) =>
  unitController.findAllUnitsForDropdown(req, res),
);
router.get('/', (req, res) => unitController.findAllUnits(req, res));
router.get('/:pkid', (req, res) => unitController.findUnitByID(req, res));
router.get('/search', (req, res) =>
  unitController.findUnitsByCriteria(req, res),
);
//endregion

//region Create methods
router.post('/', (req, res) => unitController.createUnit(req, res));
//endregion

//region Update methods
router.put('/:pkid', (req, res) => unitController.updateUnit(req, res));
//endregion

//region Delete & Restore methods
router.delete('/soft/:pkid', (req, res) =>
  unitController.softDeleteUnit(req, res),
);
router.delete('/hard/:pkid', (req, res) =>
  unitController.hardDeleteUnit(req, res),
);
router.put('/restore/:pkid', (req, res) =>
  unitController.restoreUnit(req, res),
);
//endregion

export default router;

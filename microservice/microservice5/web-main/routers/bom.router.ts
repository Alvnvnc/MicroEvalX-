import { Router } from 'express';
import { BomController } from '../controllers/bom.controller';

const router = Router();
const bomController = new BomController();

//region Other Method
router.get('/generateCsv', (req, res) => bomController.generateCsv(req, res));
//endregion

//region Find methods
router.get('/dropdown', (req, res) => bomController.getBomsDropdown(req, res));
router.get('/headers', (req, res) => bomController.findAllBomHeaders(req, res));
router.get('/search', (req, res) => bomController.findBomsByCriteria(req, res));
router.get('/item-end-product/:itemEndProductPkid', (req, res) =>
  bomController.getBomByItemEndProductPkid(req, res),
);
router.get('/', (req, res) => bomController.findAllBoms(req, res));
router.get('/:pkid', (req, res) => bomController.findBomByID(req, res));

//endregion

//region Find Calculated methods
router.post('/getBomDataByItemHeaderAndQuantity', (req, res) =>
  bomController.getBomDataByItemHeaderAndQuantity(req, res),
);
//endregion

//region Check methods
router.post('/checkRawMaterialsAvailability', (req, res) =>
  bomController.checkRawMaterialsAvailability(req, res),
);
//endregion

//region Create methods
router.post('/', (req, res) => bomController.createBom(req, res));
//endregion

//region Update methods
router.put('/:pkid', (req, res) => bomController.updateBom(req, res));
//endregion

//region Delete & Restore methods
router.delete('/soft/:pkid', (req, res) =>
  bomController.softDeleteBom(req, res),
);
router.delete('/hard/:pkid', (req, res) =>
  bomController.hardDeleteBom(req, res),
);
router.put('/restore/:pkid', (req, res) => bomController.restoreBom(req, res));
//endregion

export default router;

import { Router } from 'express';
import { ReceiveController } from '../controllers/receive.controller';

const router = Router();
const receiveController = new ReceiveController();

//region Other Method
router.get('/generateCsv', (req, res) =>
  receiveController.generateCsv(req, res),
);
//endregion

//region Find methods
router.get('/dropdown', (req, res) =>
  receiveController.getReceivesDropdown(req, res),
);
router.get('/headers', (req, res) =>
  receiveController.findAllReceiveHeaders(req, res),
);
router.get('/search', (req, res) =>
  receiveController.findReceivesByCriteria(req, res),
);
router.get('/', (req, res) => receiveController.findAllReceives(req, res));
router.get('/:pkid', (req, res) => receiveController.findReceiveByID(req, res));

//endregion

//region Create methods
router.post('/', (req, res) => receiveController.createReceive(req, res));
//endregion

//region Update methods
router.put('/:pkid', (req, res) => receiveController.updateReceive(req, res));
//endregion

//region Delete & Restore methods
router.delete('/soft/:pkid', (req, res) =>
  receiveController.softDeleteReceive(req, res),
);
router.delete('/hard/:pkid', (req, res) =>
  receiveController.hardDeleteReceive(req, res),
);
router.put('/restore/:pkid', (req, res) =>
  receiveController.restoreReceive(req, res),
);
//endregion

export default router;

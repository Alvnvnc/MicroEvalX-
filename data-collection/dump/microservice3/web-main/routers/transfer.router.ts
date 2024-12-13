import { Router } from 'express';
import { TransferController } from '../controllers/transfer.controller';

const router = Router();
const transferController = new TransferController();

//region Other Method
router.get('/generateCsv', (req, res) =>
  transferController.generateCsv(req, res),
);
//endregion

//region Find methods
router.get('/dropdown', (req, res) =>
  transferController.getTransfersDropdown(req, res),
);
router.get('/headers', (req, res) =>
  transferController.findAllTransferHeaders(req, res),
);
router.get('/search', (req, res) =>
  transferController.findTransfersByCriteria(req, res),
);
router.get('/', (req, res) => transferController.findAllTransfers(req, res));
router.get('/:pkid', (req, res) =>
  transferController.findTransferByID(req, res),
);
//endregion

//region Create methods
router.post('/', (req, res) => transferController.createTransfer(req, res));
//endregion

//region Update methods
router.put('/:pkid', (req, res) => transferController.updateTransfer(req, res));
//endregion

//region Delete & Restore methods
router.delete('/soft/:pkid', (req, res) =>
  transferController.softDeleteTransfer(req, res),
);
router.delete('/hard/:pkid', (req, res) =>
  transferController.hardDeleteTransfer(req, res),
);
router.put('/restore/:pkid', (req, res) =>
  transferController.restoreTransfer(req, res),
);
//endregion

export default router;

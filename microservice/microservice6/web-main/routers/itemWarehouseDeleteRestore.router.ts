import { Router } from 'express';

const router = Router();

//region Delete & Restore methods
router.delete('/soft/:pkid', (req, res) => {
  // Implement soft delete logic here
  res.send(`Soft delete item with id ${req.params.pkid}`);
});
router.delete('/hard/:pkid', (req, res) => {
  // Implement hard delete logic here
  res.send(`Hard delete item with id ${req.params.pkid}`);
});
router.put('/restore/:pkid', (req, res) => {
  // Implement restore logic here
  res.send(`Restore item with id ${req.params.pkid}`);
});
//endregion

export default router;
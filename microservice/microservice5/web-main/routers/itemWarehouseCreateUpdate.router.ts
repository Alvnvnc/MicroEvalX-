import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
  // TODO: Implement create item warehouse logic
  res.send('Item warehouse created');
});

router.put('/:pkid', (req, res) => {
  // TODO: Implement update item warehouse logic
  res.send('Item warehouse updated');
});

export default router;
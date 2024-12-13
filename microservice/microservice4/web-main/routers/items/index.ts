// routes/items/index.ts
import { Router } from 'express';
import basicItemRouter from './basic-item.route';
import categoryUnitRouter from './category-unit.route';

const router = Router();

// Mount sub-routers
router.use('/items', basicItemRouter);
router.use('/categories', categoryUnitRouter);

export default router;



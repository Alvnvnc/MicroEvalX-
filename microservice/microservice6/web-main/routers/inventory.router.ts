// import { Router } from 'express';
// import { InventoryController } from '../controllers/inventory.controller';
//
// const router = Router();
// const inventoryController = new InventoryController();
//
// //read
// // Get all inventory location
// router.get('/', (req, res) => inventoryController.getAllInventoryLocation(req, res));
//
// // Get all items in inventory sum quantity
// router.get('/all', (req, res) => inventoryController.getAllItemInventoryGroupByItemCodeAndSumQuantity(req, res));
// router.get('/all/:inventory_id', (req, res) => inventoryController.getAllItemPerInventoryIdGroupByItemCodeAndSumQuantity(req, res));
//
// //Get clean sum quantity
// router.get('/clean/:item_code', (req, res) => inventoryController.getCleanInventoryQuantityByItemCode(req, res));
//
// // Receive items
// router.post('/receive', (req, res) => inventoryController.receiveItems(req, res));
//
// export default router;

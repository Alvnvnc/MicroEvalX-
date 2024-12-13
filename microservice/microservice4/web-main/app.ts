import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from '../infrastructure/models';

import unitRouter from './routers/unit.router';
import warehouseRouter from './routers/warehouse.router';
import itemCategoryRouter from './routers/itemCategory.router';
import itemRouter from './routers/item.router';
import itemWarehouseRouter from './routers/itemWarehouse.router';
import receiveRouter from './routers/receive.router';
import transferRouter from './routers/transfer.router';
import bomRouter from './routers/bom.router';

dotenv.config();

// Create an instance of express
const app = express();

// Add CORS middleware
app.use(cors());

// Parse JSON and url-encoded query
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize database
db.sequelize
  .sync()
  .then(() => console.log('Database connected'))
  .catch((err: object) => console.log('Error syncing tables: ', err));

// Define routes
// app.use('/api/manufacture', manufactureRouter);
// app.use('/api/delayed-production', delayedProductionRouter);
app.use('/api/bom', bomRouter);
app.use('/api/item', itemRouter);
app.use('/api/itemCategory', itemCategoryRouter);
app.use('/api/itemWarehouse', itemWarehouseRouter);
app.use('/api/receive', receiveRouter);
app.use('/api/transfer', transferRouter);
app.use('/api/unit', unitRouter);
app.use('/api/warehouse', warehouseRouter);

// Set the port
const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

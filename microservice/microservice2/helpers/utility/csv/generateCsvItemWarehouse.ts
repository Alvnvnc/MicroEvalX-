import { createObjectCsvStringifier } from 'csv-writer';
import { Request } from 'express';
import { ItemWarehouseRepository } from '../../../data-access/repositories/itemWarehouse.repository';
import { ItemWarehouseAttributes } from '../../../infrastructure/models/itemWarehouse.model';
import { getAllAttributes } from '../../dto/itemWarehouse.dto';

const generateCSVItemWarehouse = async (
  req: Request,
  itemWarehouseIds?: number[],
): Promise<string> => {
  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'pkid', title: 'ID' },
      { id: 'item_pkid', title: 'Item PKID' },
      { id: 'warehouse_pkid', title: 'Warehouse PKID' },
      { id: 'quantity', title: 'Quantity' },
      { id: 'reorder_level', title: 'Reorder Level' },
      { id: 'reorder_quantity', title: 'Reorder Quantity' },
      { id: 'last_restocked', title: 'Last Restocked' },
      { id: 'expiry_date', title: 'Expiry Date' },
      { id: 'created_by', title: 'Created By' },
      { id: 'created_date', title: 'Created Date' },
      { id: 'created_host', title: 'Created Host' },
      { id: 'updated_by', title: 'Updated By' },
      { id: 'updated_date', title: 'Updated Date' },
      { id: 'updated_host', title: 'Updated Host' },
      { id: 'is_deleted', title: 'Is Deleted' },
      { id: 'deleted_by', title: 'Deleted By' },
      { id: 'deleted_date', title: 'Deleted Date' },
      { id: 'deleted_host', title: 'Deleted Host' },
    ],
  });

  try {
    const itemWarehouses = await fetchItemWarehouses(req, itemWarehouseIds);
    const records = itemWarehouses.map((itemWarehouse) =>
      getAllAttributes(itemWarehouse),
    );
    return (
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(records)
    );
  } catch (error) {
    throw new Error(String(error));
  }
};

const fetchItemWarehouses = async (
  req: Request,
  itemWarehouseIds?: number[],
): Promise<ItemWarehouseAttributes[]> => {
  const itemWarehouseRepository = new ItemWarehouseRepository();
  let itemWarehouses;

  if (itemWarehouseIds && itemWarehouseIds.length > 0) {
    itemWarehouses = await itemWarehouseRepository.where(req, {
      pkid: itemWarehouseIds,
    });
  } else {
    itemWarehouses = await itemWarehouseRepository.findAll(req);
  }

  return itemWarehouses.map(
    (itemWarehouse) => itemWarehouse.toJSON() as ItemWarehouseAttributes,
  );
};

export { generateCSVItemWarehouse };

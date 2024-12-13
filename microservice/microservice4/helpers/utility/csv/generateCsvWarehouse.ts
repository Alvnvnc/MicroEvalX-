import { createObjectCsvStringifier } from 'csv-writer';
import { Request } from 'express';
import { WarehouseRepository } from '../../../data-access/repositories/warehouse.repository';
import { WarehouseAttributes } from '../../../infrastructure/models/warehouse.model';
import { getAllAttributesVM } from '../../view-models/warehouse.vm';

const generateCSVWarehouse = async (
  req: Request,
  warehouseIds?: number[],
): Promise<string> => {
  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'pkid', title: 'ID' },
      { id: 'code', title: 'Code' },
      { id: 'name', title: 'Name' },
      { id: 'address', title: 'Address' },
      { id: 'city', title: 'City' },
      { id: 'state', title: 'State' },
      { id: 'country', title: 'Country' },
      { id: 'postal_code', title: 'Postal Code' },
      { id: 'contact_number', title: 'Contact Number' },
      { id: 'status', title: 'Status' },
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
    const warehouses = await fetchWarehouses(req, warehouseIds);
    const records = warehouses.map(getAllAttributesVM);
    return (
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(records)
    );
  } catch (error) {
    throw new Error(String(error));
  }
};

const fetchWarehouses = async (
  req: Request,
  warehouseIds?: number[],
): Promise<WarehouseAttributes[]> => {
  const warehouseRepository = new WarehouseRepository();
  let warehouses;

  if (warehouseIds && warehouseIds.length > 0) {
    warehouses = await warehouseRepository.where(req, {
      pkid: warehouseIds,
    });
  } else {
    warehouses = await warehouseRepository.findAll(req);
  }

  return warehouses.map(
    (warehouse) => warehouse.toJSON() as WarehouseAttributes,
  );
};

export { generateCSVWarehouse };

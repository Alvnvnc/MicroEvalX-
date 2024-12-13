import { createObjectCsvStringifier } from 'csv-writer';
import { Request } from 'express';
import { ItemRepository } from '../../../data-access/repositories/item.repository';
import { ItemAttributes } from '../../../infrastructure/models/item.model';
import { getAllAttributesVM } from '../../view-models/item.vm';

const generateCSVItem = async (
  req: Request,
  itemIds?: number[],
): Promise<string> => {
  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'pkid', title: 'ID' },
      { id: 'code', title: 'Code' },
      { id: 'item_category_pkid', title: 'Item Category PKID' },
      { id: 'unit_pkid', title: 'Unit PKID' },
      { id: 'tax_pkid', title: 'Tax PKID' },
      { id: 'currency_code', title: 'Currency Code' },
      { id: 'name', title: 'Name' },
      { id: 'purchase_price', title: 'Purchase Price' },
      { id: 'selling_price', title: 'Selling Price' },
      { id: 'description', title: 'Description' },
      { id: 'status', title: 'Status' },
      { id: 'sku', title: 'SKU' },
      { id: 'barcode', title: 'Barcode' },
      { id: 'weight', title: 'Weight' },
      { id: 'dimensions', title: 'Dimensions' },
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
    const items = await fetchItems(req, itemIds);
    const records = items.map(getAllAttributesVM);
    return (
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(records)
    );
  } catch (error) {
    throw new Error(String(error));
  }
};

const fetchItems = async (
  req: Request,
  itemIds?: number[],
): Promise<ItemAttributes[]> => {
  const itemRepository = new ItemRepository();
  let items;

  if (itemIds && itemIds.length > 0) {
    items = await itemRepository.where(req, {
      pkid: itemIds,
    });
  } else {
    items = await itemRepository.findAll(req);
  }

  return items.map((item) => item.toJSON() as ItemAttributes);
};

export { generateCSVItem };

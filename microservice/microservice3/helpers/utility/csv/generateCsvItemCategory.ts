import { createObjectCsvStringifier } from 'csv-writer';
import { Request } from 'express';
import { ItemCategoryRepository } from '../../../data-access/repositories/itemCategory.repository';
import { ItemCategoryAttributes } from '../../../infrastructure/models/itemCategory.model';
import { getAllAttributesVM } from '../../view-models/itemCategory.vm';

const generateCSVItemCategory = async (
  req: Request,
  itemCategoryIds?: number[],
): Promise<string> => {
  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'pkid', title: 'ID' },
      { id: 'code', title: 'Code' },
      { id: 'coa_pkid', title: 'COA PKID' },
      { id: 'name', title: 'Name' },
      { id: 'description', title: 'Description' },
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
    const itemCategories = await fetchItemCategories(req, itemCategoryIds);
    const records = itemCategories.map(getAllAttributesVM);
    return (
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(records)
    );
  } catch (error) {
    throw new Error(String(error));
  }
};

const fetchItemCategories = async (
  req: Request,
  itemCategoryIds?: number[],
): Promise<ItemCategoryAttributes[]> => {
  const itemCategoryRepository = new ItemCategoryRepository();
  let itemCategories;

  if (itemCategoryIds && itemCategoryIds.length > 0) {
    itemCategories = await itemCategoryRepository.where(req, {
      pkid: itemCategoryIds,
    });
  } else {
    itemCategories = await itemCategoryRepository.findAll(req);
  }

  return itemCategories.map(
    (itemCategory) => itemCategory.toJSON() as ItemCategoryAttributes,
  );
};

export { generateCSVItemCategory };

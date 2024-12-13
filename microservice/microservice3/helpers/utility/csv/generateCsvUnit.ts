import { createObjectCsvStringifier } from 'csv-writer';
import { Request } from 'express';
import { UnitRepository } from '../../../data-access/repositories/unit.repository';
import { UnitAttributes } from '../../../infrastructure/models/unit.model';
import { getAllAttributesVM } from '../../view-models/unit.vm';

const generateCSVUnit = async (
  req: Request,
  unitIds?: number[],
): Promise<string> => {
  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'pkid', title: 'ID' },
      { id: 'code', title: 'Code' },
      { id: 'name', title: 'Name' },
      { id: 'description', title: 'Description' },
      { id: 'symbol', title: 'Symbol' },
      { id: 'conversion_factor', title: 'Conversion Factor' },
      { id: 'base_unit', title: 'Base Unit' },
      { id: 'category', title: 'Category' },
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
    const units = await fetchUnits(req, unitIds);
    const records = units.map(getAllAttributesVM);
    return (
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(records)
    );
  } catch (error) {
    throw new Error(String(error));
  }
};

const fetchUnits = async (
  req: Request,
  unitIds?: number[],
): Promise<UnitAttributes[]> => {
  const unitRepository = new UnitRepository();
  let units;

  if (unitIds && unitIds.length > 0) {
    units = await unitRepository.where(req, {
      pkid: unitIds,
    });
  } else {
    units = await unitRepository.findAll(req);
  }

  return units.map((unit) => unit.toJSON() as UnitAttributes);
};

export { generateCSVUnit };

import { createObjectCsvStringifier } from 'csv-writer';
import { BomHeaderWithDetailsAttributes } from '../../../infrastructure/models/bomHeader.model';
import { mapBomHeaderToCSV, mapBomDetailToCSV } from '../../dto/bom.dto';

const generateCSVBom = async (
  boms: BomHeaderWithDetailsAttributes[],
): Promise<string> => {
  const csvStringifierBomHeader = createObjectCsvStringifier({
    header: [
      { id: 'pkid', title: 'ID' },
      { id: 'code', title: 'Code' },
      { id: 'item_header_pkid', title: 'Item Header ID' },
      { id: 'production_quantity', title: 'Production Quantity' },
      { id: 'status', title: 'Status' },
      { id: 'description', title: 'Description' },
      { id: 'effective_date', title: 'Effective Date' },
      { id: 'expiration_date', title: 'Expiration Date' },
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

  const csvStringifierBomDetail = createObjectCsvStringifier({
    header: [
      { id: 'pkid', title: 'ID' },
      { id: 'bom_header_pkid', title: 'BOM Header ID' },
      { id: 'item_detail_pkid', title: 'Item Detail ID' },
      { id: 'quantity', title: 'Quantity' },
      { id: 'wastage_percentage', title: 'Wastage Percentage' },
      { id: 'cost', title: 'Cost' },
      { id: 'notes', title: 'Notes' },
      { id: 'parent_bom_detail_pkid', title: 'Parent BOM Detail ID' },
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
    const bomHeaderRecords = boms.map(mapBomHeaderToCSV);
    const bomDetailRecords = boms.flatMap(
      (bom) => bom.bomDetails?.map(mapBomDetailToCSV) || [],
    );

    const bomHeaderCsv =
      csvStringifierBomHeader.getHeaderString() +
      csvStringifierBomHeader.stringifyRecords(bomHeaderRecords);

    const bomDetailCsv =
      csvStringifierBomDetail.getHeaderString() +
      csvStringifierBomDetail.stringifyRecords(bomDetailRecords);

    return bomHeaderCsv + '\n\n' + bomDetailCsv;
  } catch (error) {
    throw new Error(String(error));
  }
};

export { generateCSVBom };

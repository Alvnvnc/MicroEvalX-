import { createObjectCsvStringifier } from 'csv-writer';
import { TransferWithDetailsAttributes } from '../../../infrastructure/models/transfer.model';
import {
  mapTransferToCSV,
  mapTransferDetailToCSV,
} from '../../dto/transfer.dto';

const generateCSVTransfer = async (
  transfers: TransferWithDetailsAttributes[],
): Promise<string> => {
  const csvStringifierTransfer = createObjectCsvStringifier({
    header: [
      { id: 'pkid', title: 'ID' },
      { id: 'code', title: 'Code' },
      { id: 'from_warehouse_pkid', title: 'From Warehouse ID' },
      { id: 'to_warehouse_pkid', title: 'To Warehouse ID' },
      { id: 'supplier_pkid', title: 'Supplier ID' },
      { id: 'customer_pkid', title: 'Customer ID' },
      { id: 'transfer_date', title: 'Transfer Date' },
      { id: 'status', title: 'Status' },
      { id: 'type', title: 'Type' },
      { id: 'total_quantity', title: 'Total Quantity' },
      { id: 'total_accepted_quantity', title: 'Total Accepted Quantity' },
      { id: 'total_rejected_quantity', title: 'Total Rejected Quantity' },
      { id: 'description', title: 'Description' },
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

  const csvStringifierTransferDetail = createObjectCsvStringifier({
    header: [
      { id: 'pkid', title: 'ID' },
      { id: 'transfer_pkid', title: 'Transfer ID' },
      { id: 'item_pkid', title: 'Item ID' },
      { id: 'item_quantity', title: 'Item Quantity' },
      { id: 'item_accepted_quantity', title: 'Item Accepted Quantity' },
      { id: 'item_rejected_quantity', title: 'Item Rejected Quantity' },
      { id: 'expiry_date', title: 'Expiry Date' },
      { id: 'notes', title: 'Notes' },
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
    const transferRecords = transfers.map(mapTransferToCSV);
    const transferDetailRecords = transfers.flatMap(
      (transfer) => transfer.transferDetails?.map(mapTransferDetailToCSV) || [],
    );

    const transferCsv =
      csvStringifierTransfer.getHeaderString() +
      csvStringifierTransfer.stringifyRecords(transferRecords);

    const transferDetailCsv =
      csvStringifierTransferDetail.getHeaderString() +
      csvStringifierTransferDetail.stringifyRecords(transferDetailRecords);

    return transferCsv + '\n\n' + transferDetailCsv;
  } catch (error) {
    throw new Error(String(error));
  }
};

export { generateCSVTransfer };

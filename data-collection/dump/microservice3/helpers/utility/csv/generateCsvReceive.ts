import { createObjectCsvStringifier } from 'csv-writer';
import { ReceiveWithDetailsAttributes } from '../../../infrastructure/models/receive.model';
import { mapReceiveToCSV, mapReceiveDetailToCSV } from '../../dto/receive.dto';

const generateCSVReceive = async (
  receives: ReceiveWithDetailsAttributes[],
): Promise<string> => {
  const csvStringifierReceive = createObjectCsvStringifier({
    header: [
      { id: 'pkid', title: 'ID' },
      { id: 'code', title: 'Code' },
      { id: 'warehouse_pkid', title: 'Warehouse ID' },
      { id: 'supplier_pkid', title: 'Supplier ID' },
      { id: 'customer_pkid', title: 'Customer ID' },
      { id: 'reference_number', title: 'Reference Number' },
      { id: 'received_date', title: 'Received Date' },
      { id: 'status', title: 'Status' },
      { id: 'type', title: 'Type' },
      { id: 'total_quantity', title: 'Total Quantity' },
      { id: 'total_accepted_quantity', title: 'Total Accepted Quantity' },
      { id: 'total_rejected_quantity', title: 'Total Rejected Quantity' },
      { id: 'is_rejected', title: 'Is Rejected' },
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

  const csvStringifierReceiveDetail = createObjectCsvStringifier({
    header: [
      { id: 'pkid', title: 'ID' },
      { id: 'receive_pkid', title: 'Receive ID' },
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
    const receiveRecords = receives.map(mapReceiveToCSV);
    const receiveDetailRecords = receives.flatMap(
      (receive) => receive.receiveDetails?.map(mapReceiveDetailToCSV) || [],
    );

    const receiveCsv =
      csvStringifierReceive.getHeaderString() +
      csvStringifierReceive.stringifyRecords(receiveRecords);

    const receiveDetailCsv =
      csvStringifierReceiveDetail.getHeaderString() +
      csvStringifierReceiveDetail.stringifyRecords(receiveDetailRecords);

    return receiveCsv + '\n\n' + receiveDetailCsv;
  } catch (error) {
    throw new Error(String(error));
  }
};

export { generateCSVReceive };

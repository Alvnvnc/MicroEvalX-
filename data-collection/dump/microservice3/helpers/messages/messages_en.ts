import { MessagesKey } from './messagesKey';

export const messages_en = {
  //region Common Error messages
  [MessagesKey.NODATAFOUND]: 'No data found',
  [MessagesKey.INTERNALSERVERERROR]: 'Internal server error',
  [MessagesKey.UNKNOWNERROR]: 'An unknown error occurred',
  [MessagesKey.BADREQUEST]: 'Bad request.',
  [MessagesKey.UNAUTHORIZED]: 'Unauthorized.',
  [MessagesKey.SPESIFICDATANOTFOUND]: '{0} not found.',
  [MessagesKey.ERRORCREATION]:
    'Failed to create {0}. The creation method did not return a valid model instance.',
  [MessagesKey.ERRORGENERATECSV]: 'Error occurred while generating CSV.',
  [MessagesKey.ERRORGENERATEPDF]: 'Error occurred while generating PDF.',
  [MessagesKey.NOCHANGESMADE]: 'No changes made.',
  //endregion

  //region Common Success messages
  [MessagesKey.SUCCESSGET]: 'Data has been found.',
  [MessagesKey.SUCCESSGETBYID]:
    'Data has been found by the specified criteria.',
  [MessagesKey.SUCCESSCREATE]: 'Data has been created.',
  [MessagesKey.SUCCESSBULKCREATE]: 'Data has been bulk created.',
  [MessagesKey.SUCCESSUPDATE]: 'Data has been updated.',
  [MessagesKey.SUCCESSBULKUPDATE]: 'Data has been bulk updated.',
  [MessagesKey.SUCCESSHARDDELETE]: 'Data has been permanently deleted.',
  [MessagesKey.SUCCESSSOFTDELETE]: 'Data has been soft deleted.',
  [MessagesKey.SUCCESSRESTORE]: 'Data has been restored.',
  [MessagesKey.SUCCESSGENERATECSV]: 'CSV has been generated successfully.',
  [MessagesKey.SUCCESSGENERATEPDF]: 'PDF has been generated successfully.',
  //endregion

  //region Repository messages
  [MessagesKey.ERRORFINDINGALL]: 'Error finding all instances',
  [MessagesKey.ERRORFINDINGBYID]: 'Error finding instance by ID',
  [MessagesKey.ERRORCREATE]: 'Error occurred while creating the data.',
  [MessagesKey.ERRORBULKCREATE]: 'Error occurred while bulk creating data.',
  [MessagesKey.ERRORHARDDELETING]:
    'Error occurred while permanently deleting the data.',
  [MessagesKey.ERRORSOFTDELETING]:
    'Error occurred while soft deleting the data.',
  [MessagesKey.ERRORRESTORING]: 'Error occurred while restoring the data.',
  [MessagesKey.ERRORUPDATE]: 'Error occurred while updating the data.',
  //endregion

  //region Business Logic messages
  [MessagesKey.SUPPLIERNOTFOUND]: 'Supplier not found.',
  [MessagesKey.CUSTOMERNOTFOUND]: 'Customer not found.',
  [MessagesKey.PURCHASEORDERNOTFOUND]: 'Purchase Order not found.',
  [MessagesKey.SALESORDERNOTFOUND]: 'Sales Order not found.',
  [MessagesKey.ITEMNOTFOUND]: 'Item not found.',

  //region Item messages
  [MessagesKey.REQUIREDITEMPKID]: 'Item PK ID is required',
  //endregion

  //region Unit messages
  [MessagesKey.DUPLICATEUNITCODE]: 'Unit code {0} already exists.',
  [MessagesKey.INVALIDCATEGORY]: 'Invalid category: {0}',
  //endregion

  //region Warehouse messages
  [MessagesKey.DUPLICATEWAREHOUSECODE]: 'Warehouse code {0} already exists.',
  //endregion

  //region Receive messages
  [MessagesKey.INVALID_STATUS]: 'Invalid status.',
  [MessagesKey.INVALID_TYPE]: 'Invalid type.',
  //endregion

  //region BOM messages
  [MessagesKey.BOMITEMHEADERNOTFOUND]:
    'BOM Header with item_header_pkid {0} not found.',
  [MessagesKey.ERRORCHECKINGQUANTITY]:
    'Error occurred while checking quantity.',
  [MessagesKey.ACTIVEBOMNOTFOUND]:
    'Active BOM not found for item header with pkid {0}.',
  //endregion

  //endregion
};

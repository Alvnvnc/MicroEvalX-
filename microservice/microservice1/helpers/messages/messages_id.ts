import { MessagesKey } from './messagesKey';

export const messages_id = {
  //region Common Error messages
  [MessagesKey.NODATAFOUND]: 'Data tidak ditemukan',
  [MessagesKey.INTERNALSERVERERROR]: 'Kesalahan server internal',
  [MessagesKey.UNKNOWNERROR]: 'Terjadi kesalahan yang tidak diketahui',
  [MessagesKey.BADREQUEST]: 'Permintaan tidak valid.',
  [MessagesKey.UNAUTHORIZED]: 'Tidak terotorisasi.',
  [MessagesKey.SPESIFICDATANOTFOUND]: '{0} tidak ditemukan.',
  [MessagesKey.ERRORCREATION]:
    'Gagal membuat {0}. Metode pembuatan tidak mengembalikan instansi model yang valid.',
  [MessagesKey.ERRORGENERATECSV]: 'Terjadi kesalahan saat membuat CSV.',
  [MessagesKey.ERRORGENERATEPDF]: 'Terjadi kesalahan saat membuat PDF.',
  [MessagesKey.NOCHANGESMADE]: 'Tidak ada perubahan yang dilakukan.',
  //endregion

  //region Common Success messages
  [MessagesKey.SUCCESSGET]: 'Data telah ditemukan.',
  [MessagesKey.SUCCESSGETBYID]:
    'Data telah ditemukan berdasarkan kriteria yang ditentukan.',
  [MessagesKey.SUCCESSCREATE]: 'Data telah dibuat.',
  [MessagesKey.SUCCESSBULKCREATE]: 'Data telah dibuat secara massal.',
  [MessagesKey.SUCCESSUPDATE]: 'Data telah diperbarui.',
  [MessagesKey.SUCCESSBULKUPDATE]: 'Data telah diperbarui secara massal.',
  [MessagesKey.SUCCESSHARDDELETE]: 'Data telah dihapus secara permanen.',
  [MessagesKey.SUCCESSSOFTDELETE]: 'Data telah dihapus secara lunak.',
  [MessagesKey.SUCCESSRESTORE]: 'Data telah dipulihkan.',
  [MessagesKey.SUCCESSGENERATECSV]: 'CSV telah berhasil dibuat.',
  [MessagesKey.SUCCESSGENERATEPDF]: 'PDF telah berhasil dibuat.',
  //endregion

  //region Repository messages
  [MessagesKey.ERRORFINDINGALL]: 'Terjadi kesalahan saat mencari semua data',
  [MessagesKey.ERRORFINDINGBYID]:
    'Terjadi kesalahan saat mencari data berdasarkan ID',
  [MessagesKey.ERRORCREATE]: 'Terjadi kesalahan saat membuat data.',
  [MessagesKey.ERRORBULKCREATE]:
    'Terjadi kesalahan saat membuat data secara massal.',
  [MessagesKey.ERRORHARDDELETING]:
    'Terjadi kesalahan saat menghapus data secara permanen.',
  [MessagesKey.ERRORSOFTDELETING]:
    'Terjadi kesalahan saat menghapus data secara lunak.',
  [MessagesKey.ERRORRESTORING]: 'Terjadi kesalahan saat memulihkan data.',
  [MessagesKey.ERRORUPDATE]: 'Terjadi kesalahan saat memperbarui data.',
  //endregion

  //region Business Logic messages
  [MessagesKey.SUPPLIERNOTFOUND]: 'Supplier tidak ditemukan.',
  [MessagesKey.CUSTOMERNOTFOUND]: 'Customer tidak ditemukan.',
  [MessagesKey.PURCHASEORDERNOTFOUND]: 'Purchase Order tidak ditemukan.',
  [MessagesKey.SALESORDERNOTFOUND]: 'Sales Order tidak ditemukan.',
  [MessagesKey.ITEMNOTFOUND]: 'Item tidak ditemukan.',

  //region Item messages
  [MessagesKey.REQUIREDITEMPKID]: 'Item PK ID diperlukan',
  //endregion

  //region Unit messages
  [MessagesKey.DUPLICATEUNITCODE]: 'Kode unit {0} sudah ada.',
  [MessagesKey.INVALIDCATEGORY]: 'Kategori tidak valid: {0}',
  //endregion

  //region Warehouse messages
  [MessagesKey.DUPLICATEWAREHOUSECODE]: 'Kode gudang {0} sudah ada.',
  //endregion

  //region Receive messages
  [MessagesKey.INVALID_STATUS]: 'Status tidak valid.',
  [MessagesKey.INVALID_TYPE]: 'Tipe tidak valid.',
  //endregion

  //region BOM messages
  [MessagesKey.BOMITEMHEADERNOTFOUND]:
    'BOM Header dengan item_header_pkid {0} tidak ditemukan.',
  [MessagesKey.ERRORCHECKINGQUANTITY]:
    'Terjadi kesalahan saat memeriksa kuantitas.',
  [MessagesKey.ACTIVEBOMNOTFOUND]:
    'BOM aktif tidak ditemukan untuk item header dengan pkid {0}.',
  //endregion

  //endregion
};

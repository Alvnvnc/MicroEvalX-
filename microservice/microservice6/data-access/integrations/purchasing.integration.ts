import { purchaseAPI } from './index';

export const findPurchaseOrderByCode = (code: string) => {
  return purchaseAPI.get(`/purchaseOrder/search?code=${code}`);
};

export const findSupplierByID = (pkid: number) => {
  return purchaseAPI.get(`/supplier/${pkid}`);
};

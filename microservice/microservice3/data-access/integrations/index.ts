import axios from 'axios';

export const inventoryAPI = axios.create({
  baseURL: process.env.BASE_URL_INVENTORY,
});

export const manufacturingAPI = axios.create({
  baseURL: process.env.BASE_URL_MANUFACTURING,
});

export const generalLedgerAPI = axios.create({
  baseURL: process.env.BASE_URL_GENERAL_LEDGER,
});

export const accountPayableAPI = axios.create({
  baseURL: process.env.BASE_URL_ACCOUNT_PAYABLE,
});

export const accountReceivableAPI = axios.create({
  baseURL: process.env.BASE_URL_ACCOUNT_RECEIVABLE,
});

export const cashBankAPI = axios.create({
  baseURL: process.env.BASE_URL_CASH_BANK,
});

export const hrmAPI = axios.create({
  baseURL: process.env.BASE_URL_HRM,
});

export const fixedAssetAPI = axios.create({
  baseURL: process.env.BASE_URL_FIXED_ASSET,
});

export const salesAPI = axios.create({
  baseURL: process.env.BASE_URL_SALES,
});

export const purchaseAPI = axios.create({
  baseURL: process.env.BASE_URL_PURCHASE,
});

export const generalSystemAPI = axios.create({
  baseURL: process.env.BASE_URL_GENERAL_SYSTEM,
});

export const userManagementAPI = axios.create({
  baseURL: process.env.BASE_URL_USER_MANAGEMENT,
});

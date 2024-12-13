import { salesAPI } from './index';

export const findSalesOrderByCode = (code: string) => {
  return salesAPI.get(`/salesOrder/search?code=${code}`);
};

export const findCustomerByID = (pkid: number) => {
  return salesAPI.get(`/customer/${pkid}`);
};

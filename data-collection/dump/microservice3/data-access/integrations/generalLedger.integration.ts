import { generalLedgerAPI } from './index';

export const findCoaByID = (pkid: number) =>
  generalLedgerAPI.get(`/coa/${pkid}`);

import { generalSystemAPI } from './index';

export const findCurrencyByCriteria = (criteria: {
  code?: string;
  name?: string;
}) => generalSystemAPI.get(`/currency/search`, { params: criteria });

export const findTaxByID = (id: number) => generalSystemAPI.get(`/tax/${id}`);

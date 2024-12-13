export interface CurrencyDTO {
  pkid: number;
  code: string;
  name: string;
  symbol: string;
}

export const removeAuditColumnsFromCurrency = (
  currencyData: any,
): CurrencyDTO => {
  const {
    tenant_id,
    created_by,
    created_date,
    created_host,
    updated_by,
    updated_date,
    updated_host,
    is_deleted,
    deleted_by,
    deleted_date,
    deleted_host,
    ...cleanedCurrency
  } = currencyData;
  return cleanedCurrency;
};

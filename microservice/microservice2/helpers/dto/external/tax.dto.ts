export interface TaxDTO {
  pkid: number;
  code: string;
  type: string;
  name: string;
  rate: string;
  fixed_amount?: number | null;
  description: string;
  effective_date: string;
  expiry_date?: string | null;
  jurisdiction: string;
  calculation_method: string;
  is_active: boolean;
}

export const removeAuditColumnsFromTax = (taxData: any): TaxDTO => {
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
    ...cleanedTax
  } = taxData;
  return cleanedTax;
};

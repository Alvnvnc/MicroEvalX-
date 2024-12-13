export interface SupplierDTO {
  pkid: number;
  code: string;
  name: string;
  contact_number: string;
  email: string;
  address: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
  npwp: string;
  fax_number: string;
  website: string | null;
  contact_person: string;
  payment_terms: string | null;
  bank_account: string | null;
  business_type: string;
  status: boolean;
}

export const removeAuditColumnsFromSupplier = (
  supplierData: any,
): SupplierDTO => {
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
    ...cleanedSupplier
  } = supplierData;
  return cleanedSupplier;
};

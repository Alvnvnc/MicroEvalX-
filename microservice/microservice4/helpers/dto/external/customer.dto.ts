export interface CustomerDTO {
  pkid: number;
  code: string;
  name: string;
  contact_number: string;
  email: string | null;
  address: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
  npwp: string;
  fax_number: string;
  website: string | null;
  payment_terms: string;
  customer_type: string;
  industry: string;
  account_manager: string;
  company: string;
  status: boolean;
}

export const removeAuditColumnsFromCustomer = (
  customerData: any,
): CustomerDTO => {
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
    ...cleanedCustomer
  } = customerData;
  return cleanedCustomer;
};

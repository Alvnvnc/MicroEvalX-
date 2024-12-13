export interface CoaGroupDTO {
  pkid: number;
  name: string;
  calc: string;
  code: string;
  description: string;
  account_type_pkid: number;
}

export interface AccountTypeDTO {
  pkid: number;
  name: string;
  code: string;
  can_remove: boolean;
}

export interface CoaDTO {
  pkid: number;
  name: string;
  number: string;
  normal_balance: string;
  opening_balance: string;
  entity: string;
  description: string;
  transaction_type_pkid: number;
  currency_pkid: string;
  work_centre_pkid: number;
  coa_group_pkid: number;
  account_type_pkid: number;
  per_tanggal: Date;
  CoaGroup?: CoaGroupDTO;
  AccountType?: AccountTypeDTO;
}

export const removeAuditColumnsFromCoa = (coaData: any): CoaDTO => {
  const {
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
    ...cleanedCoa
  } = coaData;
  return cleanedCoa;
};

import {FileAttach} from "@shared/model/file-attach.model";

export class TaxDeclareMastersModel {

  taxDeclareMasterId?: number;
  taxPeriodDate?: string;
  totalIncomeTaxable?: string;
  totalIncomeFreeTax?: string;
  totalInsuranceDeduction?: string;
  totalOtherDeduction?: string;
  totalIncomeTax?: string;
  totalTaxCollected?: string;
  totalTaxPayable?: string;
  totalMonthRetroTax?: string;
  totalTaxpayers?: number;
  status?: string;
  inputType?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  incomeItemMasterIds?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



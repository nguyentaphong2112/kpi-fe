import {FileAttach} from "@shared/model/file-attach.model";

export class IncomeItemMastersModel {

  incomeItemMasterId?: number;
  incomeItemId?: number;
  incomeItemName?: string;
  taxPeriodDate?: string;
  isTaxCalculated?: number;
  status?: string;
  inputTimes?: number;
  totalIncome?: string;
  totalInsuranceDeduction?: string;
  totalOtherDeduction?: string;
  totalIncomeTaxable?: string;
  totalIncomeFreeTax?: string;
  totalIncomeTax?: string;
  totalMonthRetroTax?: string;
  totalYearRetroTax?: string;
  totalReceived?: string;
  isDeleted?: string;
  taxCalBy?: string;
  taxDate?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



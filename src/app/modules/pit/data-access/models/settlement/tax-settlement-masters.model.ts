import {FileAttach} from "@shared/model/file-attach.model";

export class TaxSettlementMastersModel {

  taxSettlementMasterId?: number;
  year?: number;
  taxPeriodDate?: string;
  inputType?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  status?: string;
  taxDeclareMasterIds?: string;
  totalTaxpayers?: number;
  totalIncomeTaxable?: string;
  totalInsuranceDeduction?: string;
  totalTaxCollected?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



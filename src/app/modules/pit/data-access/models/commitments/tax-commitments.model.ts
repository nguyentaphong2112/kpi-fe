import {FileAttach} from "@shared/model/file-attach.model";

export class TaxCommitmentsModel {
  id?: number;
  taxCommitmentId?: number;
  employeeId?: number;
  employeeName?: string;
  incomeAmount?: string;
  startDate?: string;
  endDate?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  description?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



import {FileAttach} from "@shared/model/file-attach.model";

export class HealthRecordsModel {

  healthRecordId?: number;
  employeeId?: number;
  employeeName?: string;
  examinationPeriodId?: string;
  examinationDate?: string;
  resultId?: string;
  diseaseIds?: string | string[];
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



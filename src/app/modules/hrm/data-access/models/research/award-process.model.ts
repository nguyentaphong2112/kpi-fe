import {FileAttach} from "@shared/model/file-attach.model";

export class AwardProcessModel {
  awardProcessId?: number;
  employeeId?: number;
  employeeName?: string;
  awardFormId?: string;
  awardYear?: any;
  documentNo?: string;
  documentSignedDate?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



import {FileAttach} from "@shared/model/file-attach.model";

export class DisciplineProcessModel {

  disciplineProcessId?: number;
  employeeId?: number;
  employeeName?: string;
  disciplineFormId?: string;
  reason?: string;
  startDate?: string;
  endDate?: string;
  documentNo?: string;
  documentSignedDate?: string;
  signedDepartment?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



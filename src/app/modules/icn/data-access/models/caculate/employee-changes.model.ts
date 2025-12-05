import {FileAttach} from "@shared/model/file-attach.model";

export class EmployeeChangesModel {

  employeeChangeId?: number;
  periodDate?: string;
  employeeId?: number;
  employeeName?: string;
  employeeCode?: string;
  fullName?: string;
  changeDate?: string;
  changeType?: string;
  contributionType?: string;
  reason?: string;
  organizationId?: number;
  organizationName?: string;
  jobId?: number;
  jobName?: string;
  status?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



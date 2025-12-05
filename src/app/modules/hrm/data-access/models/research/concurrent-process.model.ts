import {FileAttach} from "@shared/model/file-attach.model";

export class ConcurrentProcessModel {
  id?: number;
  concurrentProcessId?: number;
  employeeId?: number;
  employeeName?: string;
  startDate?: string;
  endDate?: string;
  jobId?: number;
  jobName?: string;
  positionId?: number;
  positionName?: string;
  organizationId?: number;
  organizationName?: string;
  documentNo?: string;
  documentSignedNo?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  data: any;
  files: any;
}



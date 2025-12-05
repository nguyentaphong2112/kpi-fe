import { FileAttach } from '@shared/model/file-attach.model';

export class WorkProcessModel {
  id?: number;
  workProcessId?: number;
  employeeId?: number;
  employeeName?: string;
  startDate?: string;
  endDate?: string;
  documentTypeId?: number;
  documentTypeName?: string;
  jobId?: number;
  jobName?: string;
  positionId?: number;
  positionName?: string;
  organizationId?: number;
  organizationName?: string;
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
  data: any;
  files: any;
}



import { FileAttach } from '@app/shared/model/file-attach.model';

export class EducationProcessModel {
  educationProcessId?: number;
  employeeId?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  employeeName?: string;
  courseName?: string;
  trainingMethodId?: string;
  courseContent?: string;
  result?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



import { FileAttach } from '@shared/model/file-attach.model';

export class InsuranceSalaryProcessModel {
  id?: number;
  insuranceSalaryProcessId?: number;
  employeeId?: number;
  employeeName?: string;
  salaryRankId?: number;
  salaryRankName?: string;
  salaryGradeId?: number;
  salaryGradeName?: string;
  percent?: number | string;
  seniorityPercent?: number;
  reserveFactor?: string;
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
  data?: any;
  files?: any;
}



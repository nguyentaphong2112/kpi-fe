import {FileAttach} from "@shared/model/file-attach.model";

export class PositionSalaryProcessModel {
  id?:number;
  positionSalaryProcessId?: number;
  employeeId?: number;
  employeeName?: string;
  salaryGradeId?: number;
  salaryGradeName?: string;
  percent?: number | string;
  startDate?: string;
  endDate?: string;
  documentNo?: string;
  documentSignedDate?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  hiddenEmp?: any;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  data?: any;
  files?: any;
  formData?: any[];
}



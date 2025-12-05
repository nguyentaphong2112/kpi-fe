import { FileAttach } from '@shared/model/file-attach.model';

export class AnnualLeavesModel {

  annualLeaveId?: number;
  year?: number;
  employeeId?: number;
  employeeName?: string;
  employeeCode?: string;
  jobName?: string;
  organizationName?: string;
  positionName?: string ;
  startDate?: string;
  endDate?: string;
  seniority?: string;
  workingMonths?: number;
  unpaidMonths?: number;
  accidentMonths?: number;
  sicknessMonths?: number;
  remainDays?: number;
  annualDays?: number;
  usedDays?: number;
  usedLastYearDays?: number;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  remainLastYearDays?: string;
}



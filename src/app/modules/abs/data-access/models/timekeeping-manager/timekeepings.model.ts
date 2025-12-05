import {FileAttach} from "@shared/model/file-attach.model";

export class TimekeepingsModel {

  timekeepingId?: number;
  employeeId?: number;
  employeeName?: string;
  employeeCode?: string;
  empTypeName?: string;
  positionName?:string;
  orgName?:string;
  fullName?: string;
  dateTimekeeping?: string;
  workdayTypeId?: number;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  timekeepings?: any;
  dateList?: any;
  listTimeKeeping: TimekeepingInfor[];
}

export class TimekeepingInfor {
  dateTimekeeping?: string;
  dayOfMonth?: string;
  dayOfWeek?: string;
  totalHours?: number;
  workdayTypeCode?: string;
  timekeeping?: string;
}




import {FileAttach} from "@shared/model/file-attach.model";

export class AttendanceHistoriesModel {

  attendanceHistoryId?: number;
  employeeId?: number;
  employeeCode?: number;
  employeeName?: string;
  checkInTime?: string;
  checkOutTime?: string;
  isValid?: string;
  validName?:string;
  dateTimekeeping?: string;
  validCheckInTime?: Date;
  validCheckOutTime?: Date;
  statusId?: string;
  statusName?: string;
  reasonId?:string;
  approvedNote?:string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



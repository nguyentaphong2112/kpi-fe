import {EmployeeDetail} from "@shared/model/personal-info";


export interface RequestLeave {
  requestLeaveId?: number,
  requestId?: number,
  fromTime?: string | Date,
  toTime?: string | Date,
  timekeepingDate?: Date,
  reasonLeaveId?: number,
  partOfTime?: string,
  workPlace?: string,
  content?: string,
  note?: string,

  employeeCode?: string,
  employeeId?: number | EmployeeDetail,
  fullName?: string,
  leaveType?: string,
  pageNumber?: number,
}



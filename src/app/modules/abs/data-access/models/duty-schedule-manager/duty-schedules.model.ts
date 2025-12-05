import { FileAttach } from '@shared/model/file-attach.model';

export class DutySchedulesModel {

  dutyScheduleId?: number;
  dutyPositionId?: string;
  employeeId?: number;
  employeeName?: string;
  organizationId?: number;
  listDutySchedule?: any;
  organizationName?: string;
  dateTimekeeping?: string;
  orderNumber?: number;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  listOrganizationId?: any;
  dateValue?: any;
  listData?: any;
  monthValue?: any;
}



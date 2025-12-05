import {FileAttach} from "@shared/model/file-attach.model";

export class WorkCalendarsModel {
  id?: number;
  workCalendarId?: number;
  name?: string;
  monWorkTimeId?: string;
  tueWorkTimeId?: string;
  wedWorkTimeId?: string;
  thuWorkTimeId?: string;
  friWorkTimeId?: string;
  satWorkTimeId?: string;
  sunWorkTimeId?: string;
  defaultHodidayDate?: string;
  startDate?: string;
  endDate?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



import {FileAttach} from "@shared/model/file-attach.model";

export class WorkCalendarDetailsModel {

  workCalendarDetailId?: number;
  workCalendarId?: number;
  workCalendarName?: string;
  dateTimekeeping?: string;
  workdayTimeId?: string;
  description?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



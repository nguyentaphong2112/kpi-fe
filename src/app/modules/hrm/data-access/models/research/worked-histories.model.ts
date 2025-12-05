import {FileAttach} from "@shared/model/file-attach.model";

export class WorkedHistoriesModel {

  workedHistoryId?: number;
  employeeId?: any;
  employeeName?: string;
  startDate?: string;
  endDate?: string;
  job?: string;
  companyName?: string;
  referenceName?: string;
  referenceJob?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



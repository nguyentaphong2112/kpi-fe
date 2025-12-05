import {FileAttach} from "@shared/model/file-attach.model";

export class DynamicReportQueriesModel {

  dynamicReportQueryId?: number;
  dynamicReportId?: number;
  dynamicReportName?: string;
  orderNumber?: number;
  sqlQuery?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



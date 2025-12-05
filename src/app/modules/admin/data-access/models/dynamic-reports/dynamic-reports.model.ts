import {FileAttach} from "@shared/model/file-attach.model";

export class DynamicReportsModel {

  dynamicReportId?: number;
  code?: string;
  name?: string;
  reportType?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



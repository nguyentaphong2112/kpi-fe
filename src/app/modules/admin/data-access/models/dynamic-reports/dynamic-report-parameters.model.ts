import {FileAttach} from "@shared/model/file-attach.model";

export class DynamicReportParametersModel {

  dynamicReportParameterId?: number;
  dynamicReportId?: number;
  dynamicReportName?: string;
  orderNumber?: number;
  appendQuery?: string;
  dataType?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



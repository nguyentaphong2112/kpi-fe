import {FileAttach} from "@shared/model/file-attach.model";

export class ConfigChartsModel {

  configChartId?: number;
  code?: string;
  name?: string;
  type?: string;
  sqlQuery?: string;
  url?: string;
  color?: string;
  serviceName?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



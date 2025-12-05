import {FileAttach} from "@shared/model/file-attach.model";

export class ConfigPagesModel {

  configPageId?: number;
  url?: string;
  reportCodes?: string | string[];
  type?:string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



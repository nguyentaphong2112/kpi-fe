import {FileAttach} from "@shared/model/file-attach.model";

export class PytagoValuesModel {

  pytagoValueId?: number;
  indexNo?: string;
  value?: number;
  objectId?: number;
  objectName?: string;
  tableName?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



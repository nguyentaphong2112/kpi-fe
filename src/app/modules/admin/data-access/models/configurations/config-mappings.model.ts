import {FileAttach} from "@shared/model/file-attach.model";

export class ConfigMappingsModel {

  configMappingId?: number;
  code?: string;
  name?: string;
  parameterTitle?: string;
  valueTitle?: string;
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



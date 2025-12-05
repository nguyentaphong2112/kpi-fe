import {FileAttach} from "@shared/model/file-attach.model";

export class MappingValuesModel {

  mappingValueId?: number;
  parameter?: string;
  value?: string;
  startDate?: string;
  endDate?: string;
  configMappingCode?: string;
  parameterTitle?:string;
  valueTitle?:string;
  dataType?:string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  dataConfigMappingSelect?: any;
}



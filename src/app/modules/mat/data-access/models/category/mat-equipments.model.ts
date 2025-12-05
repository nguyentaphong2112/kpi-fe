import {FileAttach} from "@shared/model/file-attach.model";

export class MatEquipmentsModel {

  equipmentId?: number;
  name?: string;
  equipmentGroupId?: number;
  equipmentGroupName?: string;
  equipmentTypeId?: number;
  equipmentTypeName?: string;
  equipmentUnitId?: number;
  equipmentUnitName?: string;
  warningDays?: string;
  isSerialChecking?: string | boolean;
  serialNo?: string;
  unitPrice?: string;
  note?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  code?: string;
  description?: string;
  location?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



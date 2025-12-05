import {FileAttach} from "@shared/model/file-attach.model";

export class MatWarehousesModel {

  warehouseId?: number;
  code?: string;
  name?: string;
  parentId?: number;
  parentName?: string;
  buildingId?: number;
  buildingName?: string;
  address?: string;
  departmentId?: number;
  departmentName?: string;
  type?: string;
  statusId?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  note?: string;
  pathId?: string;
  pathOrder?: string;
  pathLevel?: number;
  orderNumber?: number;
  attachFileList?: Array<FileAttach>;
  listEmployee?: any[];
  listEquipment?: any[];
  listIncomingShipment?: any[];
  listInventoryAdjustment?: any[];
  listOutgoingShipment?: any[];
  employeeIds?: number[];
}



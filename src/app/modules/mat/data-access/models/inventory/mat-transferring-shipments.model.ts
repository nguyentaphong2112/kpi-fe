import {FileAttach} from "@shared/model/file-attach.model";

export class MatTransferringShipmentsModel {

  transferringShipmentId?: number;
  warehouseId?: number;
  warehouseName?: string;
  transferringDate?: string;
  receivedWarehouseId?: number;
  receivedWarehouseName?: string;
  transferredEmployeeId?: number;
  transferredEmployeeName?: string;
  approvedBy?: string;
  approvedTime?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  pickingNo?: string;
  statusId?: string;
  name?: string;
  receivedEmployeeId?: number;
  receivedEmployeeName?: string;
  createdEmployeeId?: number;
  createdEmployeeName?: string;
  note?: string;
  approvedNote?: string;
  files?: Array<FileAttach>;
  docIdsDelete?: number[];
  listEquipments?: any[];
  listEquipmentIds?: number[];
}



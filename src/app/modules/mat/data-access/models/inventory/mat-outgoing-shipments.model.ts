import {FileAttach} from "@shared/model/file-attach.model";

export class MatOutgoingShipmentsModel {

  outgoingShipmentId?: number;
  warehouseId?: number;
  warehouseName?: string;
  pickingNo?: string;
  outgoingDate?: string;
  pickingEmployeeId?: number;
  pickingEmployeeName?: string;
  receiverId?: number;
  receiverName?: string;
  note?: string;
  incomingShipmentId?: number;
  incomingShipmentName?: string;
  statusId?: string;
  approvedBy?: string;
  approvedTime?: string;
  transferringShipmentId?: number;
  transferringShipmentName?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  type?: string;
  approvedNote?: string;
  files?: Array<FileAttach>;
  docIdsDelete?: number[];
  listEquipments?: any[];
  listEquipmentIds?: number[];
}



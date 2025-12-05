import {FileAttach} from "@shared/model/file-attach.model";

export class MatIncomingShipmentsModel {

  incomingShipmentId?: number;
  warehouseId?: number;
  warehouseName?: string;
  pickingNo?: string;
  incomingDate?: string;
  pickingEmployeeId?: number;
  pickingEmployeeName?: string;
  authorId?: number;
  authorName?: string;
  contractId?: number;
  contractName?: string;
  partnerName?: string;
  invoiceId?: string;
  shippedBy?: string;
  note?: string;
  statusId?: string;
  type?: string;
  approvedBy?: string;
  approvedTime?: string;
  transferWarehouseId?: number;
  transferWarehouseName?: string;
  transferredDate?: string;
  receiverId?: number;
  receiverName?: string;
  transferringShipmentId?: number;
  transferringShipmentName?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  approvedNote?: string;
  transferPickingNo?: string;
  contractNo?: string;
  contractAmount?: string;
  files?: Array<FileAttach>;
  docIdsDelete?: number[];
  listEquipments?: any[];
  listEquipmentIds?: number[];
}



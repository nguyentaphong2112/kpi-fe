import {FileAttach} from "@shared/model/file-attach.model";

export class MatInventoryAdjustmentsModel {

  inventoryAdjustmentId?: number;
  warehouseId?: number;
  warehouseName?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  note?: string;
  inventoryAdjustmentNo?: string;
  checkedEmployeeId?: number;
  checkedEmployeeName?: string;
  statusId?: string;
  approvedBy?: string;
  approvedTime?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  approvedNote?: string;
  files?: Array<FileAttach>;
  docIdsDelete?: number[];
  listEquipments?: any[];
  listEquipmentIds?: number[];
}



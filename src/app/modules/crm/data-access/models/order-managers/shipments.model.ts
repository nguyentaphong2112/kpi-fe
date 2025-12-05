import {FileAttach} from "@shared/model/file-attach.model";

export class ShipmentsModel {

  shipmentId?: number;
  orderId?: number;
  orderName?: string;
  shipperId?: string;
  shipmentDate?: string;
  trackingNo?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



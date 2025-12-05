import {FileAttach} from "@shared/model/file-attach.model";

export class RequestsModel {

  requestId?: number;
  employeeId?: number;
  employeeName?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  reasonTypeId?: number;
  reasonTypeName?: string;
  note?: string;
  requestNo?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  listAbsRequest: AbsRequest[];
  listRequestHandovers: AbsHandover[];
}


export class AbsRequest {
  reasonTypeId: number;
  startTime: string;
  endTime: string;
}

export class AbsHandover{
  requestHandoverId: number;

  requestId: number;

  employeeId: number;

  empHandoverId: number;

  orderNumber: number;

  content : string;
}


import {FileAttach} from "@shared/model/file-attach.model";

export class WarningConfigsModel {
  warningConfigId?: number;
  title?: string;
  resource?: string;
  backgroundColor?: string;
  icon?: string;
  apiUri?: string;
  urlViewDetail?: string;
  sqlQuery?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  isMustPositive?: string;
  orderNumber?: number;
  docIdsDelete?: number[];
}



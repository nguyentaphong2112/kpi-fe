import {FileAttach} from "@shared/model/file-attach.model";

export class LogActionsModel {
  logActionId?: number;
  action?: string;
  actionName?: string;
  objType?: string;
  objId?: number;
  dataBefore?: string;
  dataAfter?: string;
  startDate?: string;
  endDate?:string;
  loginName?: string;
  objName?: string;
  listObjType?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}
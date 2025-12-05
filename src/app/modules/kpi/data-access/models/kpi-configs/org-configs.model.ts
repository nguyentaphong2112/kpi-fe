import {FileAttach} from "@shared/model/file-attach.model";

export class OrgConfigsModel {

  orgConfigId?: number;
  organizationId?: number;
  organizationName?: string;
  year?: string;
  note?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



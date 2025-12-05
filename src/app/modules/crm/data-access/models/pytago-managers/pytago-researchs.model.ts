import {FileAttach} from "@shared/model/file-attach.model";

export class PytagoResearchsModel {

  pytagoResearchId?: number;
  fullName?: string;
  dateOfBirth?: string;
  parentName?: string;
  mobileNumber?: string;
  email?: string;
  currentAddress?: string;
  type?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



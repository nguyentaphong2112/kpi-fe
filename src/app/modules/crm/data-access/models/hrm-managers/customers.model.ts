import {FileAttach} from "@shared/model/file-attach.model";

export class CustomersModel {

  customerId?: number;
  fullName?: string;
  mobileNumber?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



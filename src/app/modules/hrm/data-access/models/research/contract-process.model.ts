import {FileAttach} from "@shared/model/file-attach.model";

export class ContractProcessModel {
  id?: number;
  contractProcessId?: number;
  employeeId?: number;
  employeeName?: string;
  empTypeId?: number;
  empTypeName?: string;
  contractTypeId?: number;
  contractTypeName?: string;
  startDate?: string;
  endDate?: string;
  documentNo?: string;
  documentSignedDate?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  data?: any;
  files?: any;
}



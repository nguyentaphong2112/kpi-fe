import {FileAttach} from "@shared/model/file-attach.model";

export class CustomerCareRecordsModel {

  customerCareRecordId?: number;
  customerId?: number;
  customerName?: string;
  fullName?: string;
  mobileNumber?: string;
  dateOfBirth?: string;
  requestDate?: string;
  requestedEmpId?: number;
  requestedEmpName?: string;
  caringEmpId?: number;
  caringEmpName?: string;
  contactDate?: string;
  caringStatusId?: string;
  note?: string;
  statusId?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



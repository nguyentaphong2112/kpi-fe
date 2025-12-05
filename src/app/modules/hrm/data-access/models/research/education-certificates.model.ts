import {FileAttach} from "@shared/model/file-attach.model";

export class EducationCertificatesModel {
  id?: number;
  educationCertificateId?: number;
  employeeId?: number;
  employeeName?: string;
  certificateTypeId?: string;
  certificateName?: string;
  certificateId?: string;
  issuedPlace?: string;
  issuedDate?: string;
  expiredDate?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  data?: any;
  files: any;
}



import {FileAttach} from "@shared/model/file-attach.model";

export class PartnersModel {
  id?: number;
  partnerId?: number;
  fullName?: string;
  dateOfBirth?: string;
  mobileNumber?: string;
  zaloAccount?: string;
  email?: string;
  partnerType?: string;
  currentAddress?: string;
  job?:string;
  departmentName?: string;
  provinceId?: number;
  districtId?: number;
  wardId?: number;
  villageAddress?: string;
  bankAccount?: string;
  bankName?: string;
  bankBranch?: string;
  genderId?: number;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  objType?: string;
  listObjType?: string;
}
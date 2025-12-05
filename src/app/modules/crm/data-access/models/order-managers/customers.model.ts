import {FileAttach} from "@shared/model/file-attach.model";
import {FamilyRelationshipsModel} from "@app/modules/crm/data-access/models/hrm-managers/family-relationships.model";

export class CustomersModel {
  id?:number;
  customerId?: number;
  fullName?: string;
  mobileNumber?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  loginName?: string;
  genderId?: string;
  dateOfBirth?: string;
  email?: string;
  zaloAccount?: string;
  introducerId?: number;
  introducerName?: string;
  userTakeCareId?: number;
  userTakeCareName?: string;
  job?: string;
  departmentName?: string;
  provinceId?: string;
  districtId?: string;
  wardId?: string;
  villageAddress?: string;
  bankAccount?: string;
  bankName?: string;
  bankBrach?: string;
  status?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  listFamilyRelationship ?: FamilyRelationshipsModel[];
  objType?: string;
  listObjType?: string;
}



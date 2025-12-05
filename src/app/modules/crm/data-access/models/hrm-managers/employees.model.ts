import { FamilyRelationshipsModel } from '@app/modules/crm/data-access/models/hrm-managers/family-relationships.model';

export class EmployeesModel {

  employeeId?: number;
  fullName?: string;
  dateOfBirth?: string;
  mobileNumber?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  loginName?: string;
  genderId?: string;
  email?: string;
  zaloAccount?: string;
  positionTitleId?: string;
  departmentId?: string;
  managerId?: number;
  managerName?: string;
  jobRankId?: string;
  provinceId?: string;
  districtId?: string;
  wardId?: string;
  villageAddress?: string;
  bankAccount?: string;
  bankName?: string;
  bankBranch?: string;
  status?: string;
  personalIdNo?: string;
  taxNo?: string;
  insuranceNo?: string;
  docIdsDelete?: number[];
  positionTitleName?: string;
  departmentName?: string;
  profileAttachments?: ProfileAttachments[];
  listAttributes?: any[];
  familyRelationships?: FamilyRelationshipsModel[];
  familyRelationshipIdDelete?: number[];
}

export interface ProfileAttachments {
  fileAttachments?: any[];
  attachFileList?: any[];
  idsDelete?: number[];
  attachmentType?: string;
  attachmentTypeName?: string;
}

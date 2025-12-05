import { FileAttach } from '@shared/model/file-attach.model';

export class FamilyRelationshipsModel {
  familyRelationshipId?: number;
  employeeId?: any;
  employeeName?: string;
  employeeCode?: string;
  relationTypeId?: string;
  fullName?: string;
  relationStatusId?: string;
  policyTypeId?: string;
  dateOfBirth?: string;
  dateOfBirthStr?: string;
  job?: string;
  organizationAddress?: string;
  currentAddress?: string;
  personalIdNo?: string;
  mobileNumber?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  relationTypeName?: string;
  relationStatusName: string;
  policyTypeName: string;
  typeDateOfBirth?: string;
}



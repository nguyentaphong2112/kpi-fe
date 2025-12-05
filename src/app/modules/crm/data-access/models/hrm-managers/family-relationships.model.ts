import {FileAttach} from '@shared/model/file-attach.model';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

export class FamilyRelationshipsModel {

  familyRelationshipId?: number;
  objectType?: string;
  objectId?: number;
  objectName?: string;
  relationTypeId?: string;
  relationTypeName?: string;
  dateOfBirth?: string | Date;
  fullName?: string;
  mobileNumber?: string;
  email?: string;
  zaloAccount?: string;
  facebookAccount?: string;
  currentAddress?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  departmentName?: string;
  provinceId?: number;
  districtId?: number;
  job?: string;
  relationStatusId?: string;
  villageAddress?: string;
  wardId?: number;
  listAttributes?: NzSafeAny;
}



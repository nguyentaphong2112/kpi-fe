import {FileAttach} from "@shared/model/file-attach.model";

export class ExternalTrainingsModel {

  externalTrainingId?: number;
  typeId?: string;
  fullName?: string;
  genderId?: string;
  yearOfBirth?: string;
  mobileNumber?: string;
  personalIdNo?: string;
  address?: string;
  organizationAddress?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



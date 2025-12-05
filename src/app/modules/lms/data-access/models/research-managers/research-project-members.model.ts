import {FileAttach} from "@shared/model/file-attach.model";

export class ResearchProjectMembersModel {

  researchProjectMemberId?: number;
  researchProjectId?: number;
  researchProjectName?: string;
  roleId?: string;
  employeeId?: number;
  employeeName?: string;
  orderNumber?: number;
  note?: string;
  type?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



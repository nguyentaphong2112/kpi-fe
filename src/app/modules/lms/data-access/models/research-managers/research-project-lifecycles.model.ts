import {FileAttach} from "@shared/model/file-attach.model";

export class ResearchProjectLifecyclesModel {

  researchProjectLifecycleId?: number;
  researchProjectId?: number;
  researchProjectName?: string;
  documentNo?: string;
  documentSignedDate?: string;
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



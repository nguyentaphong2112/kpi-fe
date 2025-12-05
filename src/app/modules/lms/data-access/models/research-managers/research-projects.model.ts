import { FileAttach } from '@shared/model/file-attach.model';

export class ResearchProjectsModel {

  researchProjectId?: number;
  title?: string;
  content?: string;
  target?: string;
  projectTypeId?: string;
  organizationId?: number;
  organizationName?: string;
  researchLevelId?: string;
  researchTopicId?: string;
  duration?: string;
  estimatedBudget?: string;
  statusId?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  listMembers?: any;
  lifecycles?: any;
  listLifecycles?: any;
}



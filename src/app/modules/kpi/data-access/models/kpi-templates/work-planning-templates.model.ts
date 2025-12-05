import {FileAttach} from '@shared/model/file-attach.model';

export class WorkPlanningTemplatesModel {

  workPlanningTemplateId?: number;
  name?: string;
  content?: string;
  configColumns?: any;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



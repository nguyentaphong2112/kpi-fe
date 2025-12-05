import {FileAttach} from "@shared/model/file-attach.model";

export class TrainingProgramsModel {

  trainingProgramId?: number;
  title?: string;
  lessons?: any;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



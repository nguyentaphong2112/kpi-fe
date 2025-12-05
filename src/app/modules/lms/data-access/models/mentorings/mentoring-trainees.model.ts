import { FileAttach } from '@shared/model/file-attach.model';

export class MentoringTraineesModel {
  id?: number;
  medMentoringTraineeId?: number;
  employeeId?: number;
  employeeName?: string;
  startDate?: string;
  endDate?: string;
  projectId?: string;
  hospitalId?: string;
  totalLessons?: number;
  content?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  data?: any;
  files: any;
}



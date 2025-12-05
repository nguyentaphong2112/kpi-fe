import { FileAttach } from '@shared/model/file-attach.model';

export class CoursesModel {

  courseId?: number;
  trainingProgramId?: number;
  trainingProgramName?: string;
  startDate?: string;
  endDate?: string;
  name?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  lessons?: any;
  listCoursesTrainees?: any;
  oldTraineeIds?: number[];
}



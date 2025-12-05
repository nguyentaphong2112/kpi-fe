import {FileAttach} from "@shared/model/file-attach.model";

export class CourseTraineesModel {

  courseTraineeId?: number;
  courseId?: number;
  courseName?: string;
  traineeId?: number;
  traineeName?: string;
  instructorId?: number;
  instructorName?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



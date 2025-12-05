import {FileAttach} from "@shared/model/file-attach.model";

export class CourseLessonsModel {

  courseLessonId?: number;
  name?: string;
  courseId?: number;
  courseName?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



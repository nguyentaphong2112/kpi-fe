import {FileAttach} from "@shared/model/file-attach.model";

export class SessionsModel {

  sessionId?: number;
  code?: string;
  name?: string;
  description?: string;
  examPaperId?: number;
  examPaperName?: string;
  subjectCode?: string;
  topicCode?: string;
  examTypeCode?: string;
  modeCode?: string;
  totalQuestions?: number;
  totalScore?: string;
  durationMinutes?: number;
  startTime?: Date;
  endTime?: Date;
  allowRetakes?: string;
  maxAttempts?: number;
  allowLateMinutes?: number;
  randomizeQuestions?: string;
  randomizeOptions?: string;
  password?: string;
  visibilityCode?: string;
  requireWebcam?: string;
  showResultAfterSubmit?: string;
  showCorrectAnswers?: string;
  statusCode?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  semester?: string;
  academicYear?: string;
  year?: number;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



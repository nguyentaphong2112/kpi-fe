import {FileAttach} from "@shared/model/file-attach.model";

export class QuestionsModel {

  questionId?: number;
  code?: string;
  subjectCode?: string;
  topicCode?: string;
  typeCode?: string;
  sectionCode?: string;
  levelCode?: string;
  skillType?: string;
  questionGroupId?: number;
  questionGroupName?: string;
  orderNumber?: number;
  defaultScore?: string;
  defaultWeight?: string;
  timeSuggestedSeconds?: number;
  content?: string;
  explanation?: string;
  solution?: string;
  statusCode?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  subjectName: string;
  point: number;
}



import {FileAttach} from "@shared/model/file-attach.model";

export class InternshipSessionDetailsModel {

  internshipSessionDetailId?: number;
  internshipSessionId?: number;
  internshipSessionName?: string;
  majorId?: string;
  numOfStutdents?: number;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



import {FileAttach} from "@shared/model/file-attach.model";

export class InternshipSessionsModel {

  internshipSessionId?: number;
  universityId?: string;
  sessionName?: string;
  startDate?: string;
  endDate?: string;
  totalStudents?: number;
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
  details?: any;
  id?:any;
}



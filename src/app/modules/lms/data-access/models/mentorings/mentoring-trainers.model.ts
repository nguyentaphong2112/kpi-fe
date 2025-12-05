import {FileAttach} from "@shared/model/file-attach.model";

export class MentoringTrainersModel {

  mentoringTrainerId?: number;
  startDate?: string;
  endDate?: string;
  majorId?: string;
  hospitalId?: string;
  content?: string;
  className?: string;
  totalLessons?: number;
  totalClasses?: number;
  totalStudents?: number;
  totalExaminations?: number;
  totalSurgeries?: number;
  totalTests?: number;
  employeeId?: number;
  employeeName?: string;
  roleId?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  listParticipating: Partici[];
}

export class Partici{
  employeeId: number;
  roleId : string;
}


import {FileAttach} from "@shared/model/file-attach.model";

export class EducationDegreesModel {
  id?: number;
  educationDegreeId?: number;
  employeeId?: number;
  employeeName?: string;
  majorId?: string;
  majorName?: string;
  majorLevelId?: string;
  majorLevelName?: string;
  trainingMethodId?: string;
  trainingSchoolId?: string;
  trainingSchoolName?: string;
  isHighest?: string;
  graduatedYear?: string;
  graduatedRankId?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  files?: any;
  data?: any;
}



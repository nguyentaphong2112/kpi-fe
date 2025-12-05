import {FileAttach} from "@shared/model/file-attach.model";

export class TrainingProcessModel {
  id?: number;
  data?: any;
  trainingProcessId?: number;
  employeeId?: number;
  employeeName?: string;
  startDate?: string;
  endDate?: string;
  majorId?: string;
  trainingPlaceId?: string;
  trainingPlanId?: string;
  trainingCourseId?: string;
  documentNo?: string;
  documentSignedDate?: string;
  totalBudget?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  files: any;
  budgetsList?: any;
}



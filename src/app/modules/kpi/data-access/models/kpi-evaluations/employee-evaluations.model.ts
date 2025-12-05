import { FileAttach } from '@shared/model/file-attach.model';

export class EmployeeEvaluationsModel {

  employeeEvaluationId?: number;
  evaluationPeriodId?: number;
  evaluationPeriodName?: string;
  employeeId?: number;
  employeeName?: string;
  status?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  id?: number;
  ids?: number[];
  content?: string;
  listId?: any[];
  isEvaluateManage?: boolean;
  reason?: string;
  reasonRequest?: string;
}



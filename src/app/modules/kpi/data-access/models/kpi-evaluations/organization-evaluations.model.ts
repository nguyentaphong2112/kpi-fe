import { FileAttach } from '@shared/model/file-attach.model';

export class OrganizationEvaluationsModel {

  organizationEvaluationId?: number;
  organizationId?: number;
  organizationName?: string;
  evaluationPeriodId?: number;
  evaluationPeriodName?: string;
  status?: string;
  empManagerId?: number;
  empManagerName?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  id?: number;
  ids?: number[];
  content?: string;
  adjustReason?: string;
  workPlanningList?: any;
  organizationIndicatorList?: any;
  managerTotalPoint?: number;
  selfTotalPoint?: number;
  reason?: string;
  reasonRequest?: string;
  listId?: any;
  isConfirm?: string;
  listData?: any;
}



import {FileAttach} from "@shared/model/file-attach.model";

export class IncomeItemsModel {

  incomeItemId?: number;
  incomeTemplateId?: number;
  incomeTemplateName?: string;
  code?: string;
  name?: string;
  salaryPeriodDate?: string | any;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



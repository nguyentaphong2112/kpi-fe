import {FileAttach} from "@shared/model/file-attach.model";

export class ContributionRatesModel {

  contributionRateId?: number;
  empTypeCode?: string;
  unitSocialPercent?: string;
  perSocialPercent?: string;
  unitMedicalPercent?: string;
  perMedicalPercent?: string;
  unitUnempPercent?: string;
  perUnempPercent?: string;
  unitUnionPercent?: string;
  perUnionPercent?: string;
  startDate?: string;
  endDate?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  baseUnionPercent?: string;
  modUnionPercent?: string;
  superiorUnionPercent?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



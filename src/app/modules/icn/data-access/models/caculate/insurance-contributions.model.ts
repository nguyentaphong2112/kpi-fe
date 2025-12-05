import {FileAttach} from "@shared/model/file-attach.model";

export class InsuranceContributionsModel {

  insuranceContributionId?: number;
  periodDate?: string;
  employeeId?: number;
  employeeName?: string;
  empTypeCode?: string;
  labourType?: string;
  jobId?: number;
  jobName?: string;
  orgId?: number;
  orgName?: string;
  contractSalary?: number;
  reserveSalary?: number;
  posAllowanceSalary?: number;
  senioritySalary?: number;
  posSenioritySalary?: number;
  totalSalary?: number;
  perSocialAmount?: number;
  unitSocialAmount?: number;
  perMedicalAmount?: number;
  unitMedicalAmount?: number;
  perUnempAmount?: number;
  unitUnempAmount?: number;
  unitUnionAmount?: number;
  baseUnionAmount?: number;
  superiorUnionAmount?: number;
  modUnionAmount?: number;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  status?: string;
  reason?: string;
  note?: string;
  insuranceFactor?: string;
  insuranceBaseSalary?: string;
  reserveFactor?: string;
  allowanceFactor?: string;
  seniorityPercent?: string;
  posSeniorityPercent?: string;
  insuranceTimekeeping?: string;
  leaveTimekeeping?: string;
  leaveReason?: string;
  maternityTimekeeping?: string;
  insuranceAgency?: string;
  type?: string;
  rejectReason?: string;
  totalAmount?: number;
  retroForPeriodDate?: string;
  retirementSocialAmount?: number;
  sicknessSocialAmount?: number;
  accidentSocialAmount?: number;
  debitOrgId?: number;
  debitOrgName?: string;
  startDate?: string;
  endDate?: string;
  insuranceRetractionId?: number;
  insuranceRetractionName?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



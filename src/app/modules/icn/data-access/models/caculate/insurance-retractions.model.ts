import {FileAttach} from "@shared/model/file-attach.model";

export class InsuranceRetractionsModel {

  insuranceRetractionId?: number;
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
  totalAmount?: string;
  retroPeriodDate?: string;
  lastUpdateTime?: string;
  insuranceContributionId?: number;
  insuranceContributionName?: string;
  tableType?: string;
  baseId?: number;
  baseName?: string;
  retirementSocialAmount?: number;
  sicknessSocialAmount?: number;
  accidentSocialAmount?: number;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}



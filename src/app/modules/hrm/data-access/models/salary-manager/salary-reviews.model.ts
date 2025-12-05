export class SalaryReviewsModel {
  salaryReviewId?: number;
  employeeId?: number;
  type?: string;
  periodId?: string;
  employeeCode?: string;
  fullName?: string;
  positionTitle?: string;
  organizationId?: number;
  salaryRankId?: number;

  salaryGradeId?: number;
  factorSalaryGrade?: number;
  applyDate?: string;
  incrementDate?: string;

  proposedApplyDate?: string;
  proposedSalaryGradeId?: number;
  factorProposedSalaryGrade?: number;

  awardInfos?: string;
  punishmentInfos?: string;
  r0TimekeepingMonths?: string;
  reviewStatusId?: string;
  statusId?: string;
  salaryRankName?: string;
  salaryGradeName?: string;
  salaryGradeAmount?: number;
  organizationName?: string;
  jobName?: string;
  proposedSalaryGradeName?: string;
  proposedSalaryGradeAmount?: number;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
}

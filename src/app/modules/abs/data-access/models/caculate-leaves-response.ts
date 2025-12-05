import { AbsRequestApprovers } from "./request-approvers";

export interface CaculateLeavesResponse {
  employeeId?: number;
  fromTime?: string;
  toTime?: string;
  reasonLeaveId?: number;
  totalDays?: number;
  allDays?: number;
  approvers?: {
    level?: number;
    approvers?: AbsRequestApprovers[];
  }[],
  listApprovers?: {
    approvalOrder?: number;
    approvalLevel?: number;
    isHr?: number;
  }[];
}
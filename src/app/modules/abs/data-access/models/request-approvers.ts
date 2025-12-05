import {EmployeeDetail} from "@app/modules/hrm/data-access/models/personal-info";


export interface AbsRequestApprovers {
  requestApproverId?: number,
  requestId?: number,
  employeeId?: number | EmployeeDetail,
  approvalOrder?: number,
  approvalLevel?: number,
  hrLevel?: number,
  status?: number,
  isAllowView?: number,
  employeeCode?: string,
  fullName?: string,
  email?: string,
  posititonName?: string,
  organizationName?: string,
}

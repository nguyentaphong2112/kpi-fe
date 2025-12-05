import { Component } from '@angular/core';
import { FunctionCode } from '@shared/enums/enums-constant';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { FrpFormComponent } from '@app/modules/hrm/pages/staff-research/family-relationship/frp-form/frp-form.component';

@Component({
  selector: 'app-frp-index',
  templateUrl: './frp-index.component.html',
  styleUrls: ['./frp-index.component.scss']
})
export class FrpIndexComponent {
  functionCode = FunctionCode.HR_FAMILY_RELATIONSHIP;
  moduleName = Constant.MODULE_NAME.FAMILY_RELATIONSHIPS;
  urlConstant = UrlConstant;
  fileExportName = 'thong_tin_than_nhan.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.familyRelationshipInfo',
    content: FrpFormComponent
  };
  tableHeaders: HBTTableHeader[] = [
    {
      title: 'STT',
      thClassList: ['text-center'],
      tdClassList: ['text-center'],
      fixedDir: 'left',
      width: 50,
      fixed: window.innerWidth > 1024,
    },
    {
      title: 'hrm.staffManager.staffResearch.relatives.table.employeeCode',
      field: 'employeeCode',
      width: 120,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.relatives.table.employeeName',
      field: 'fullName',
      width: 150,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.relatives.table.orgName',
      field: 'orgName',
      width: 200
    },
    {
      title: 'hrm.staffManager.staffResearch.relatives.table.empTypeName',
      field: 'empTypeName',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.relatives.table.jobName',
      field: 'jobName',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.relatives.table.relationTypeCode',
      field: 'relationTypeName',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.relatives.table.fullName',
      field: 'familyRelationshipName',
      width: 150
    },
    {
      title: 'hrm.staffManager.staffResearch.relatives.table.dateOfBirth',
      field: 'dateOfBirthStr',
      width: 100,
      tdClassList: ['text-center'],
      thClassList: ['text-center']
    },
    {
      title: 'hrm.staffManager.staffResearch.relatives.table.relationStatusCode',
      field: 'relationStatusName',
      width: 130
    },
    {
      title: 'hrm.staffManager.staffResearch.relatives.table.policyTypeCode',
      field: 'policyTypeName',
      width: 130
    },
    {
      title: 'hrm.staffManager.staffResearch.relatives.table.personalIdNumber',
      field: 'personalIdNo',
      width: 120,
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.relatives.table.phoneNumber',
      field: 'mobileNumber',
      width: 100,
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.relatives.table.workOrganization',
      field: 'organizationAddress',
      width: 150,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.relatives.table.currentAddress',
      field: 'currentAddress',
      width: 150,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.relatives.table.flagStatus',
      field: 'empStatusName',
      width: 100,
      show: false
    },
    {
      title: 'common.label.createdBy',
      field: 'createdBy',
      width: 150,
      show: false
    },
    {
      title: 'common.label.createdTime',
      tdClassList: ['text-center'],
      field: 'createdTime',
      width: 120,
      show: false
    },
    {
      title: 'common.label.modifiedBy',
      field: 'modifiedBy',
      width: 150,
      show: false
    },
    {
      title: 'common.label.modifiedTime',
      tdClassList: ['text-center'],
      field: 'modifiedTime',
      width: 120,
      show: false
    },
  ];



}

import { Component } from '@angular/core';
import { FunctionCode } from '@shared/enums/enums-constant';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { WhyFormComponent } from '@app/modules/hrm/pages/staff-research/worked-history/why-form/why-form.component';

@Component({
  selector: 'app-why-index',
  templateUrl: './why-index.component.html',
  styleUrls: ['./why-index.component.scss']
})
export class WhyIndexComponent {
  functionCode = FunctionCode.HR_WORKED_HISTORIES;
  moduleName = Constant.MODULE_NAME.WORK_OUT;
  urlConstant = UrlConstant;
  fileExportName = 'qua_trinh_cong_tac_ngoai.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.workedHistoryInfo',
    content: WhyFormComponent
  };
  tableHeaders: HBTTableHeader[] = [
    {
      title: 'STT',
      thClassList: ['text-center'],
      tdClassList: ['text-center'],
      fixedDir: 'left',
      width: 50,
      fixed: window.innerWidth > 1024
    },
    {
      title: 'hrm.staffManager.staffResearch.workHisBefore.table.employeeCode',
      field: 'employeeCode',
      width: 120,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.workHisBefore.table.employeeName',
      field: 'fullName',
      width: 150,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.workHisBefore.table.orgName',
      field: 'orgName',
      width: 200,
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.empTypeName',
      field: 'empTypeName',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.positionName',
      field: 'jobName',
      width: 120,
    },
    {
      title: 'hrm.staffManager.staffResearch.workHisBefore.table.fromMonth',
      field: 'startDate',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.workHisBefore.table.toMonth',
      field: 'endDate',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.workHisBefore.table.beforeOrganizationName',
      field: 'companyName',
      width: 200,
    },
    {
      title: 'hrm.staffManager.staffResearch.workHisBefore.table.beforePositionName',
      field: 'job',
      width: 150,
    },
    {
      title: 'hrm.staffManager.staffResearch.workHisBefore.table.referPerson',
      field: 'referenceName',
      width: 130,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.workHisBefore.table.referPersonPosition',
      field: 'referenceJob',
      width: 130,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.workHis.table.flagStatus',
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

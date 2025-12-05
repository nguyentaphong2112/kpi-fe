import { Component } from '@angular/core';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@shared/enums/enums-constant';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { PonFormComponent } from '@app/modules/hrm/pages/staff-research/participation/pon-form/pon-form.component';

@Component({
  selector: 'app-pon-index',
  templateUrl: './pon-index.component.html',
  styleUrls: ['./pon-index.component.scss']
})
export class PonIndexComponent {
  moduleName = Constant.MODULE_NAME.POLITICAL_PARTICIPATIONS;
  functionCode: string = FunctionCode.HR_POLITICAL_PARTICIPATIONS;
  urlConstant = UrlConstant;
  fileExportName = '';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.participation',
    content: PonFormComponent
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
      title: 'hrm.staffManager.participation.table.employeeCode',
      field: 'employeeCode',
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.participation.table.fullName',
      field: 'fullName',
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.participation.table.orgName',
      field: 'orgName'
    },
    {
      title: 'hrm.staffManager.participation.table.empTypeName',
      field: 'empTypeName'
    },
    {
      title: 'hrm.staffManager.participation.table.positionName',
      field: 'jobName'
    },
    {
      title: 'hrm.staffManager.participation.table.fromDate',
      field: 'startDate',
      width: 120
    },
    {
      title: 'hrm.staffManager.participation.table.toDate',
      field: 'endDate',
      width: 120
    },
    {
      title: 'hrm.staffManager.participation.table.orgType',
      field: 'organizationTypeName'
    },
    {
      title: 'hrm.staffManager.participation.table.positionTitle',
      field: 'positionTitleName',
      show: false
    },
    {
      title: 'hrm.staffManager.participation.table.organizationName',
      field: 'organizationName',
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
    }
  ];

}

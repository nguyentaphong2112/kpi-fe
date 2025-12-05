import { Component } from '@angular/core';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@shared/enums/enums-constant';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { DpsFormComponent } from '@app/modules/hrm/pages/staff-research/discipline-process/dps-form/dps-form.component';

@Component({
  selector: 'app-dps-index',
  templateUrl: './dps-index.component.html',
  styleUrls: ['./dps-index.component.scss']
})
export class DpsIndexComponent {
  moduleName = Constant.MODULE_NAME.DISCIPLINE;
  functionCode: string = FunctionCode.HR_DISCIPLINE_PROCESS;
  urlConstant = UrlConstant;
  fileExportName = 'thong_tin_ky_luat.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.disciplineProcessInfo',
    content: DpsFormComponent
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
      title: 'hrm.staffManager.staffResearch.discipline.table.employeeCode',
      field: 'employeeCode',
      width: 100,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.discipline.table.fullName',
      field: 'fullName',
      width: 150,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.discipline.table.orgName',
      field: 'orgName',
      width: 200
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
      title: 'hrm.staffManager.staffResearch.discipline.table.documentNo',
      field: 'documentNo',
      width: 100,
    },
    {
      title: 'hrm.staffManager.staffResearch.discipline.table.signedDate',
      field: 'documentSignedDate',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.discipline.table.disciplineMethodName',
      field: 'disciplineFormName',
      width: 150
    },
    {
      title: 'hrm.staffManager.staffResearch.discipline.table.reason',
      field: 'reason',
      width: 150,
    },
    {
      title: 'hrm.staffManager.staffResearch.discipline.table.disciplineLevelName',
      field: 'signedDepartment',
      width: 150
    },
    {
      title: 'hrm.staffManager.staffResearch.discipline.table.effectiveDate',
      field: 'startDate',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.discipline.table.expirationDate',
      field: 'endDate',
      width: 100,
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
    },
    {
      title: 'hrm.staffManager.staffResearch.discipline.table.flagStatus',
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

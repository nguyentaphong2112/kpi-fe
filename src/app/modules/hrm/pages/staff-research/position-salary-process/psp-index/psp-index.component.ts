import { Component } from '@angular/core';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@shared/enums/enums-constant';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { PspFormComponent } from '@app/modules/hrm/pages/staff-research/position-salary-process/psp-form/psp-form.component';

@Component({
  selector: 'app-psp-index',
  templateUrl: './psp-index.component.html',
  styleUrls: ['./psp-index.component.scss']
})
export class PspIndexComponent {
  moduleName = Constant.MODULE_NAME.POSITION_SALARY_PROCESS;
  functionCode: string = FunctionCode.HR_POSITION_SALARY_PROCESS;
  urlConstant = UrlConstant;
  fileExportName = 'qua_trinh_luong_truong.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.positionSalaryProcessInfo',
    content: PspFormComponent
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
      title: 'hrm.staffManager.staffResearch.eduHis.table.employeeCode',
      field: 'employeeCode',
      fixed: window.innerWidth > 1024,
      width: 120,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.fullName',
      field: 'fullName', width: 150,
      needEllipsis: true,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.orgName',
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
      title: 'hrm.staffManager.positionSalaryProcess.table.startDate',
      field: 'startDate',
      width: 100,
      tdClassList: ['text-center'],
      thClassList: ['text-center']
    },
    {
      title: 'hrm.staffManager.positionSalaryProcess.table.endDate',
      field: 'endDate',
      width: 100,
      tdClassList: ['text-center'],
      thClassList: ['text-center']
    },
    {
      title: 'hrm.staffManager.insuranceSalaryProcess.table.salaryType',
      field: 'salaryTypeName',
      width: 160
    },
    {
      title: 'hrm.staffManager.positionSalaryProcess.table.jobName',
      field: 'salaryJobName',
      width: 180
    },
    {
      title: 'hrm.staffManager.positionSalaryProcess.table.salaryRankId',
      field: 'salaryRankName',
      width: 150
    },
    {
      title: 'hrm.staffManager.positionSalaryProcess.table.salaryGradeId',
      field: 'salaryGradeName',
      width: 110
    },
    {
      title: 'hrm.staffManager.positionSalaryProcess.table.percent',
      field: 'percent',
      width: 80,
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.flagStatus',
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

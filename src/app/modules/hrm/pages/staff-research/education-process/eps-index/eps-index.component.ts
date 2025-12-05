import { Component } from '@angular/core';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@shared/enums/enums-constant';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { EpsFormComponent } from '@app/modules/hrm/pages/staff-research/education-process/eps-form/eps-form.component';

@Component({
  selector: 'app-eps-index',
  templateUrl: './eps-index.component.html',
  styleUrls: ['./eps-index.component.scss']
})
export class EpsIndexComponent {
  moduleName = Constant.MODULE_NAME.EDUCATION_PROCESS;
  functionCode: string = FunctionCode.HR_EDUCATION_PROCESS;
  urlConstant = UrlConstant;
  fileExportName = 'qua_trinh_dao_tao.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.educationProcessInfo',
    content: EpsFormComponent
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
      title: 'hrm.staffManager.educationProcess.table.startDate',
      field: 'startDate',
      width: 100,
      tdClassList: ['text-center']
    },
    {
      title: 'hrm.staffManager.educationProcess.table.endDate',
      field: 'endDate',
      width: 100,
      tdClassList: ['text-center']
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.courseName',
      field: 'courseName',
      width: 150
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.eduMethodTypeName',
      field: 'trainingMethodName',
      width: 100
    }, {
      title: 'hrm.staffManager.staffResearch.eduHis.table.courseContent',
      field: 'courseContent',
      width: 150
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.eduFrom',
      field: 'fromDate',
      width: 100,
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.eduTo',
      field: 'toDate',
      width: 100,
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.trainingMethodPlace',
      field: 'trainingMethodPlace',
      width: 120,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.refundAmount',
      field: 'refundAmount',
      width: 110,
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.commitmentDate',
      field: 'commitmentDate',
      width: 100,
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      show: false
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

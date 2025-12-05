import {Component} from '@angular/core';
import {Constant} from '@app/modules/hrm/data-access/constant/constant.class';
import {FunctionCode} from '@shared/enums/enums-constant';
import {HBTTableHeader} from '@shared/component/hbt-table/hbt-table.interfaces';
import {UrlConstant} from '@app/modules/hrm/data-access/constant/url.class';
import {CpsFormComponent} from '@app/modules/hrm/pages/staff-research/concurrent-process/cps-form/cps-form.component';

@Component({
  selector: 'app-cps-index',
  templateUrl: './cps-index.component.html',
  styleUrls: ['./cps-index.component.scss']
})
export class CpsIndexComponent {
  moduleName = Constant.MODULE_NAME.CONCURRENT_PROCESS;
  functionCode: string = FunctionCode.HR_CONCURRENT_PROCESS;
  urlConstant = UrlConstant;
  fileExportName = 'qua_trinh_kiem_nhiem.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.concurrentProcessInfo',
    content: CpsFormComponent
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
      title: 'hrm.staffManager.staffResearch.concurrentProcess.label.employeeCode',
      field: 'employeeCode',
      width: 120,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.concurrentProcess.label.fullName',
      field: 'fullName',
      width: 150,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.concurrentProcess.label.orgName',
      field: 'orgName',
      width: 200,
    },
    {
      title: 'hrm.staffManager.staffResearch.concurrentProcess.label.empTypeName',
      field: 'empTypeName',
      width: 150
    },
    {
      title: 'hrm.staffManager.staffResearch.concurrentProcess.label.positionName',
      field: 'jobName',
      width: 150,
    },
    {
      title: 'hrm.staffManager.staffResearch.concurrentProcess.label.fromDate',
      field: 'startDate',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.concurrentProcess.label.toDate',
      field: 'endDate',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.concurrentProcess.label.concurrentOrg',
      field: 'concurrentOrg',
      width: 200,
    },
    {
      title: 'hrm.staffManager.staffResearch.concurrentProcess.label.concurrentPos',
      field: 'concurrentJob',
      width: 200,
    },
    {
      title: 'hrm.staffManager.staffResearch.concurrentProcess.label.documentNo',
      field: 'documentNo',
      width: 120,
    },
    {
      title: 'hrm.staffManager.staffResearch.concurrentProcess.label.signedDate',
      field: 'documentSignedDate',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.concurrentProcess.label.flagStatus',
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

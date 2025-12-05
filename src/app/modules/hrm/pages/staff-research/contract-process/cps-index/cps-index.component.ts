import { Component } from '@angular/core';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@shared/enums/enums-constant';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { CpsFormComponent } from '../cps-form/cps-form.component';

@Component({
  selector: 'app-cpp-index',
  templateUrl: './cps-index.component.html',
  styleUrls: ['./cps-index.component.scss']
})
export class CpsIndexComponent {
  moduleName = Constant.MODULE_NAME.CONTRACT;
  functionCode: string = FunctionCode.HR_CONTRACT_PROCESS;
  urlConstant = UrlConstant;
  fileExportName = 'qua_trinh_hop_dong.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.contractProcessInfo',
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
      title: 'hrm.staffManager.staffResearch.contractHis.table.employeeCode',
      field: 'employeeCode',
      width: 100,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.contractHis.table.fullName',
      field: 'fullName',
      width: 150,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.contractHis.table.fromDate',
      field: 'startDate',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.contractHis.table.toDate',
      field: 'endDate',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 100,
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.empTypeName',
      field: 'empTypeName',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.contractHis.table.contractTypeName',
      field: 'contractTypeName',
      width: 150
    },
    {
      title: 'hrm.staffManager.staffResearch.contractHis.table.signedDate',
      field: 'documentSignedDate',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 100,
    },
    {
      title: 'hrm.staffManager.staffResearch.contractHis.label.positionName',
      field: 'jobName',
      width: 150,
    },
    {
      title: 'hrm.staffManager.staffResearch.contractHis.label.orgName',
      field: 'orgName',
      width: 200,
    },
    {
      title: 'hrm.staffManager.staffResearch.contractHis.table.flagStatus',
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


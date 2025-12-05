import { Component } from '@angular/core';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@shared/enums/enums-constant';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { ApsFormComponent } from '../aps-form/aps-form.component';

@Component({
  selector: 'app-aps-index',
  templateUrl: './aps-index.component.html',
  styleUrls: ['./aps-index.component.scss']
})
export class ApsIndexComponent {
  moduleName = Constant.MODULE_NAME.ALLOWANCE;
  functionCode: string = FunctionCode.HR_ALLOWANCE_PROCESS;
  urlConstant = UrlConstant;
  fileExportName = 'dien_bien_phu_cap.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.allowanceProcessInfo',
    content: ApsFormComponent
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
      title: 'hrm.staffManager.staffResearch.allowanceHis.table.employeeCode',
      field: 'employeeCode', width: 120,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.allowanceHis.table.fullName',
      field: 'fullName', width: 150,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.allowanceHis.table.orgName',
      field: 'orgName', width: 200,
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
      title: 'hrm.staffManager.staffResearch.allowanceHis.table.fromDate',
      field: 'startDate',
      width: 100,
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
    },
    {
      title: 'hrm.staffManager.staffResearch.allowanceHis.table.toDate',
      field: 'endDate',
      width: 100,
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
    }, {
      title: 'hrm.staffManager.staffResearch.allowanceHis.table.allowanceTypeName',
      field: 'allowanceTypeName',
      width: 120,
    },
    {
      title: 'hrm.staffManager.staffResearch.allowanceHis.table.amountMoney',
      field: 'amount',
      fieldType: 'pipe',
      fieldTypeValue: 'currency',
      width: 120,
      tdClassList: ['text-center'],
      thClassList: ['text-center']
    },
    {
      title: 'hrm.staffManager.staffResearch.allowanceHis.table.documentNo',
      field: 'documentNo',
      width: 100,
      thClassList: ['text-center']
    },
    {
      title: 'hrm.staffManager.staffResearch.allowanceHis.table.documentSignedDate',
      field: 'documentSignedDate',
      width: 100,
      thClassList: ['text-center'],
      tdClassList: ['text-center']
    },
    {
      title: 'hrm.staffManager.staffResearch.allowanceHis.table.flagStatus',
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
    }
  ];

}

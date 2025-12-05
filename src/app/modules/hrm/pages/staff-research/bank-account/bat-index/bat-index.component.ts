import { Component, Injector, OnInit } from '@angular/core';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { BatFormComponent } from '@app/modules/hrm/pages/staff-research/bank-account/bat-form/bat-form.component';
import { HBTTableHeader } from '@app/shared/component/hbt-table/hbt-table.interfaces';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-bat-index',
  templateUrl: './bat-index.component.html',
  styleUrls: ['./bat-index.component.scss']
})
export class BatIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  functionCode = FunctionCode.HR_BANK_ACCOUNTS;
  moduleName = Constant.MODULE_NAME.BANK_ACCOUNT;
  urlConstant = UrlConstant;
  fileExportName = 'thong_tin_tai_khoan.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.bankAccountInfo',
    content: BatFormComponent
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
      title: 'hrm.staffManager.bankAccount.table.employeeCode',
      field: 'employeeCode',
      fixed: window.innerWidth > 1024,
      width: 75,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.bankAccount.table.fullName',
      field: 'fullName',
      fixed: window.innerWidth > 1024,
      width: 110,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.bankAccount.table.orgName',
      field: 'orgName',
      width: 200,
    },
    {
      title: 'hrm.staffManager.bankAccount.table.empTypeName',
      field: 'empTypeName',
      width: 75
    },
    {
      title: 'hrm.staffManager.bankAccount.table.positionName',
      field: 'jobName',
      width: 120,
    },
    {
      title: 'hrm.staffManager.bankAccount.table.accountType',
      field: 'accountTypeName',
      width: 120,
    },
    {
      title: 'hrm.staffManager.bankAccount.table.accountNo',
      field: 'accountNo',
      width: 80,
    },
    {
      title: 'hrm.staffManager.bankAccount.table.bankName',
      field: 'bankName',
      width: 100
    },
    {
      title: 'hrm.staffManager.bankAccount.table.bankBranch',
      field: 'bankBranch',
      width: 150
    },
    {
      title: 'hrm.staffManager.bankAccount.table.isPaymentAccount',
      field: 'isMain',
      tdClassList: ['text-center'],
      width: 70,
    },
    {
      title: 'hrm.staffManager.bankAccount.table.flagStatus',
      field: 'empStatusName',
      width: 75,
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

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.initFormImport();
  }

  initFormImport() {
    this.formImport = this.fb.group({
      isForceUpdate: [false, [Validators.required]]
    });
  }

}

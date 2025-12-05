import { Component, Injector, OnInit } from '@angular/core';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { PiyFormComponent } from '@app/modules/hrm/pages/staff-research/personal-identity/piy-form/piy-form.component';
import { Validators } from '@angular/forms';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-piy-index',
  templateUrl: './piy-index.component.html',
  styleUrls: ['./piy-index.component.scss']
})
export class PiyIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  functionCode = FunctionCode.HR_PERSONAL_IDENTITIES;
  moduleName = Constant.MODULE_NAME.IDENTITY;
  urlConstant = UrlConstant;
  fileExportName = 'thong_tin_than_nhan.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.identityInfo',
    content: PiyFormComponent
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
      title: 'hrm.staffManager.staffResearch.identity.table.employeeCode',
      field: 'employeeCode',
      width: 120,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.identity.table.fullName',
      field: 'fullName',
      width: 150,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.identity.table.orgName',
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
      title: 'hrm.staffManager.staffResearch.identity.table.label',
      field: 'identityTypeName',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.identity.table.idNo',
      field: 'identityNo',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.identity.table.idIssuePlace',
      field: 'identityIssuePlace',
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.identity.table.idIssueDate',
      field: 'identityIssueDate',
      width: 100,
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
    },
    {
      title: 'hrm.staffManager.staffResearch.identity.table.isMain',
      field: 'isMain',
      width: 100,
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.identity.table.flagStatus',
      field: 'empStatusName',
      width: 120,
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
      isForceUpdate: [false, [Validators.required]],
      identityTypeId: [null, [Validators.required]],
    });
  }

}

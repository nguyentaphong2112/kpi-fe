import { Component, Injector, OnInit } from '@angular/core';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@shared/enums/enums-constant';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { ApsFormComponent } from '@app/modules/hrm/pages/staff-research/award-process/aps-form/aps-form.component';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-aps-index',
  templateUrl: './aps-index.component.html',
  styleUrls: ['./aps-index.component.scss']
})
export class ApsIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  moduleName = Constant.MODULE_NAME.AWARD;
  functionCode: string = FunctionCode.HR_AWARD_PROCESS;
  urlConstant = UrlConstant;
  fileExportName = 'thong_tin_khen_thuong.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.awardProcessInfo',
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
      title: 'hrm.staffManager.staffResearch.rewardRecord.table.employeeCode',
      field: 'employeeCode',
      width: 120,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.rewardRecord.table.fullName',
      field: 'fullName',
      width: 150,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.rewardRecord.table.orgName',
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
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.rewardRecord.table.year',
      field: 'awardYear',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 80
    },
    {
      title: 'hrm.staffManager.staffResearch.rewardRecord.table.rewardTitle',
      field: 'awardFormName',
      width: 130
    },
    {
      title: 'hrm.staffManager.staffResearch.rewardRecord.table.documentNumber',
      field: 'documentNo',
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.rewardRecord.table.decideDate',
      field: 'documentSignedDate',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.rewardRecord.table.flagStatus',
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


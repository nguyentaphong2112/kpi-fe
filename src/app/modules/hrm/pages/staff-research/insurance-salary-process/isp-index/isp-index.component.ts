import { Component, Injector, OnInit } from '@angular/core';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@shared/enums/enums-constant';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import {
  IpsFormComponent
} from '@app/modules/hrm/pages/staff-research/insurance-salary-process/ips-form/ips-form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-isp-index',
  templateUrl: './isp-index.component.html',
  styleUrls: ['./isp-index.component.scss']
})
export class IspIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  moduleName = Constant.MODULE_NAME.INSURANCE_SALARY;
  functionCode: string = FunctionCode.HR_INSURANCE_SALARY_PROCESS;
  urlConstant = UrlConstant;
  fileExportName = 'dien_bien_luong.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.insuranceSalaryInfo',
    content: IpsFormComponent
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
      title: 'hrm.staffManager.staffResearch.salary.table.employeeCode',
      field: 'employeeCode',
      width: 130,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.salary.table.fullName',
      field: 'fullName', width: 150,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.salary.table.orgName',
      field: 'orgName', width: 200
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.positionName',
      field: 'jobName',
      width: 150
    },
    {
      title: 'hrm.staffManager.insuranceSalaryProcess.table.startDate',
      field: 'startDate',
      width: 100,
      tdClassList: ['text-center']
    },
    {
      title: 'hrm.staffManager.insuranceSalaryProcess.table.endDate',
      field: 'endDate',
      width: 100,
      tdClassList: ['text-center']
    },
    {
      title: 'hrm.staffManager.insuranceSalaryProcess.table.jobSalaryId',
      field: 'jobSalaryName',
      width: 150
    },
    {
      title: 'hrm.staffManager.staffResearch.salary.table.salaryRankName',
      field: 'salaryRankName',
      width: 150
    },
    {
      title: 'hrm.staffManager.staffResearch.salary.table.salaryGradeName',
      field: 'salaryGradeName',
      width: 90
    },
    {
      title: 'hrm.staffManager.insuranceSalaryProcess.table.amount',
      field: 'amount',
      width: 120,
      fieldType: 'pipe',
      tdClassList: ['text-right'],
      fieldTypeValue: 'currency'
    },
    {
      title: 'hrm.staffManager.staffResearch.salary.table.salaryPercent',
      field: 'percent',
      width: 80,
      tdClassList: ['text-center'],
      thClassList: ['text-center']
    },
    {
      title: 'hrm.staffManager.staffResearch.salary.table.reserveFactor',
      field: 'reserveFactor',
      tdClassList: ['text-center'],
      width: 120
    },
    {
      title: 'hrm.staffManager.insuranceSalaryProcess.table.incrementDate',
      field: 'incrementDate',
      tdClassList: ['text-center'],
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.salary.table.documentNo',
      field: 'documentNo',
      width: 100,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.salary.table.documentSignedDate',
      field: 'documentSignedDate',
      width: 100,
      tdClassList: ['text-center'],
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.flagStatus',
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


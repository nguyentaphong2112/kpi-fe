import { Component, OnInit } from '@angular/core';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@shared/enums/enums-constant';
import { HBTTableHeader } from '@app/shared/component/hbt-table/hbt-table.interfaces';
import { BasicFormComponent } from '@app/modules/hrm/pages/staff-research/basic/basic-form/basic-form.component';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { EmployeeAddComponent } from '@app/modules/hrm/pages/staff-research/basic/employee-add/employee-add.component';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-basic-index',
  templateUrl: './basic-index.component.html',
  styleUrls: ['./basic-index.component.scss']
})
export class BasicIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  moduleName = Constant.MODULE_NAME.BASIC_RESEARCH;
  functionCode: string = FunctionCode.HR_PERSONAL_INFO;
  urlConstant = UrlConstant;
  fileExportName = 'thong_tin_co_ban.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.basicInfo',
    content: EmployeeAddComponent
  };
  formConfigCustom = {
    title: 'hrm.staffManager.staffResearch.pageName.basicInfo',
    content: EmployeeAddComponent
  }
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
      title: 'hrm.staffManager.staffResearch.personalInformation.table.employeeCode',
      field: 'employeeCode',
      width: 120,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.fullName',
      field: 'fullName',
      width: 150,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.orgName',
      field: 'orgName',
      width: 200
    },
    // {
    //   title: 'hrm.staffManager.staffResearch.personalInformation.table.empTypeName',
    //   field: 'empTypeName',
    //   width: 100
    // },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.positionName',
      field: 'jobName',
      width: 120,
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.dateOfBirth',
      field: 'dateOfBirth',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.email',
      field: 'email',
      width: 150
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.mobileNumber',
      field: 'mobileNumber',
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.genderName',
      field: 'genderName',
      width: 80,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.ethnicName',
      field: 'ethnicName',
      width: 100,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.religionName',
      field: 'religionName',
      width: 100,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.educationLevelName',
      field: 'educationLevelName',
      width: 100,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.personalId',
      field: 'identityNo',
      width: 100,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.religionName',
      field: 'religionName',
      width: 100,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.taxNo',
      field: 'taxNo',
      width: 100,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.insuranceNo',
      field: 'insuranceNo',
      width: 100,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.placeOfBirth',
      field: 'placeOfBirth',
      width: 100,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.maritalStatusName',
      field: 'maritalStatusName',
      width: 100,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.permanentAddress',
      field: 'permanentAddress',
      width: 200,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.currentAddress',
      field: 'currentAddress',
      width: 200,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.originalAddress',
      field: 'originalAddress',
      width: 200,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.flagStatus',
      field: 'empStatusName',
      width: 150,
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

  ngOnInit() {
    this.initFormImport();
  }

  initFormImport() {
    this.formImport = this.fb.group({
      isForceUpdate: [false, [Validators.required]]
    });
  }
}

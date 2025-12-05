import { Component } from '@angular/core';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@shared/enums/enums-constant';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { EceFormComponent } from '@app/modules/hrm/pages/staff-research/education-certificate/ece-form/ece-form.component';
import {Validators} from "@angular/forms";
import {BaseListComponent} from "@core/components/base-list.component";
import {NzSafeAny} from "ng-zorro-antd/core/types";

@Component({
  selector: 'app-ece-index',
  templateUrl: './ece-index.component.html',
  styleUrls: ['./ece-index.component.scss']
})
export class EceIndexComponent extends BaseListComponent<NzSafeAny> {

  moduleName = Constant.MODULE_NAME.EDUCATION_CERTIFICATE;
  functionCode: string = FunctionCode.HR_EDUCATION_CERTIFICATES;
  urlConstant = UrlConstant;
  fileExportName = 'thong_tin_chung_chi.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.educationCertificatesInfo',
    content: EceFormComponent
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
      title: 'hrm.staffManager.staffResearch.degree.table.employeeCode',
      field: 'employeeCode',
      width: 120,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.degree.table.fullName',
      field: 'fullName',
      width: 150,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.degree.table.orgName',
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
      title: 'hrm.staffManager.staffResearch.degree.label.certificateTypeName',
      field: 'certificateTypeName',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.degree.label.certificateName',
      field: 'certificateName',
      width: 150
    },
    {
      title: 'hrm.staffManager.educationCertificates.table.certificateResult',
      field: 'result',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.degree.label.issueDate',
      field: 'issuedDate',
      tdClassList: ['text-center'],
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.degree.label.issuePlace',
      field: 'issuedPlace',
      width: 150
    },
    {
      title: 'hrm.staffManager.staffResearch.degree.label.expiredDate',
      field: 'expiredDate',
      tdClassList: ['text-center'],
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.degree.table.flagStatus',
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
      certificateTypeId: [null]
    });
  }

}

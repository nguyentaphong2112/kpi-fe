import { Component } from '@angular/core';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@shared/enums/enums-constant';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { EdsFormComponent } from '@app/modules/hrm/pages/staff-research/education-degrees/eds-form/eds-form.component';

@Component({
  selector: 'app-eds-index',
  templateUrl: './eds-index.component.html',
  styleUrls: ['./eds-index.component.scss']
})
export class EdsIndexComponent {
  moduleName = Constant.MODULE_NAME.EDUCATION_DEGREE;
  functionCode: string = FunctionCode.HR_EDUCATION_DEGREES;
  urlConstant = UrlConstant;
  fileExportName = 'thong_tin_bang_cap.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.educationDegreesInfo',
    content: EdsFormComponent
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
      width: 120,
    },
    {
      title: 'hrm.staffManager.staffResearch.degree.label.graduatedYear',
      field: 'graduatedYear',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 80
    },
    {
      title: 'hrm.staffManager.staffResearch.degree.label.trainingSchoolName',
      field: 'trainingSchoolName',
      width: 200
    },
    {
      title: 'hrm.staffManager.staffResearch.degree.label.majorLevelName',
      field: 'majorLevelName',
      width: 150,
    },
    {
      title: 'hrm.staffManager.staffResearch.degree.label.majorName',
      field: 'majorName',
      width: 200
    },
    {
      title: 'hrm.staffManager.staffResearch.degree.label.graduatedRankName',
      field: 'graduatedRankName',
      width: 150
    },
    {
      title: 'hrm.staffManager.staffResearch.degree.label.isHighest',
      field: 'isHighest',
      width: 150,
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      show: false
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

}


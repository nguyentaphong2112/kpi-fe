import { Component } from '@angular/core';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@shared/enums/enums-constant';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { EpnFormComponent } from '@app/modules/hrm/pages/staff-research/education-promotion/epn-form/epn-form.component';

@Component({
  selector: 'app-epn-index',
  templateUrl: './epn-index.component.html',
  styleUrls: ['./epn-index.component.scss']
})
export class EpnIndexComponent {
  moduleName = Constant.MODULE_NAME.EDUCATION_PROMOTIONS;
  functionCode: string = FunctionCode.HR_EDUCATION_PROMOTIONS;
  urlConstant = UrlConstant;
  fileExportName = 'thong_tin_hoc_ham.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.educationPromotionInfo',
    content: EpnFormComponent
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
      title: 'hrm.staffManager.staffResearch.eduHis.table.employeeCode',
      field: 'employeeCode',
      fixed: window.innerWidth > 1024,
      width: 120,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.fullName',
      field: 'fullName', width: 150,
      needEllipsis: true,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.orgName',
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
      title: 'hrm.staffManager.educationPromotions.table.issuedYear',
      field: 'issuedYear',
      width: 100,
      tdClassList: ['text-center'],
      thClassList: ['text-center']
    },
    {
      title: 'hrm.staffManager.educationPromotions.table.promotionRankName',
      field: 'promotionRankName',
      width: 150
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.flagStatus',
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

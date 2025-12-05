import { Component } from '@angular/core';
import { FunctionCode } from '@shared/enums/enums-constant';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { WpsFormComponent } from '@app/modules/hrm/pages/staff-research/work-process/wps-form/wps-form.component';

@Component({
  selector: 'app-wps-index',
  templateUrl: './wps-index.component.html',
  styleUrls: ['./wps-index.component.scss']
})
export class WpsIndexComponent {
  functionCode = FunctionCode.HR_WORK_PROCESS;
  moduleName = Constant.MODULE_NAME.WORK_PROCESS;
  urlConstant = UrlConstant;
  fileExportName = 'qua_trinh_cong_tac.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.workProcessInfo',
    content: WpsFormComponent
  };
  addWidth = window.innerWidth > 1110 ? (window.innerWidth - 1110) / 2 : window.innerWidth / 3;
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
      title: 'hrm.staffManager.staffResearch.workHis.table.employeeCode',
      field: 'employeeCode',
      width: 100,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.workHis.table.fullName',
      field: 'fullName',
      width: 150,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.workHis.table.fromDate',
      field: 'startDate',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.workHis.table.toDate',
      field: 'endDate',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 100
    },
    {
      title: 'hrm.staffManager.workProcess.label.attributes.documentType',
      field: 'documentTypeName',
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.workHis.table.processOrgName',
      field: 'orgName',
      width: 150
    },
    {
      title: 'hrm.staffManager.staffResearch.workHis.table.processPosName',
      field: 'positionNameStr',
      width: 180
    },
    {
      title: 'hrm.staffManager.staffResearch.workHis.table.processOtherPosName',
      field: 'otherPositionName',
      width: 150
    },
    {
      title: 'hrm.staffManager.staffResearch.workHis.table.documentNo',
      field: 'documentNo',
      width: 80
    },
    {
      title: 'hrm.staffManager.staffResearch.workHis.table.signedDate',
      field: 'documentSignedDate',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 100
    },
    {
      title: 'hrm.staffManager.staffResearch.workHis.table.flagStatus',
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

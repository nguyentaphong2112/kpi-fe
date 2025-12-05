import {Component, Input, OnInit} from '@angular/core';
import {BaseListComponent} from "@core/components/base-list.component";
import {Constant} from "@app/modules/hrm/data-access/constant/constant.class";
import {FunctionCode} from "@shared/enums/enums-constant";

import {BasicFormComponent} from "@app/modules/hrm/pages/staff-research/basic/basic-form/basic-form.component";
import {EmployeeAddComponent} from "@app/modules/hrm/pages/staff-research/basic/employee-add/employee-add.component";
import {HBTTableHeader} from "@shared/component/hbt-table/hbt-table.interfaces";
import {Validators} from "@angular/forms";
import {UrlConstant} from "@app/modules/icn/data-access/constants/url.class";

@Component({
  selector: 'app-work-info',
  templateUrl: './work-info.component.html',
  styleUrls: ['./work-info.component.scss']
})
export class WorkInfoComponent extends BaseListComponent<any>implements OnInit {
  @Input() employeeId:string;
  isCustomSearch=true;
  functionCode: string = FunctionCode.ICN_CONFIG_PARAMETER;
  urlConstant = UrlConstant;
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
      title: 'icn.icnContribution.calculate.employeeInfo.workProcessInformation.startDate',
      field: 'startDate',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.workProcessInformation.endDate',
      field: 'endDate',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.workProcessInformation.documentTypeName',
      field: 'documentTypeName',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.workProcessInformation.documentNo',
      field: 'documentNo',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.workProcessInformation.jobName',
      field: 'jobName',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.workProcessInformation.orgName',
      field: 'orgName',
      width: 120,
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

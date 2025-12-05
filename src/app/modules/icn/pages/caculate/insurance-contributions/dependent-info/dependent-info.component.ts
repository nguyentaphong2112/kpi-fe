import {Component, Input, OnInit} from '@angular/core';
import {BaseListComponent} from "@core/components/base-list.component";
import {FunctionCode} from "@shared/enums/enums-constant";
import {UrlConstant} from "@app/modules/icn/data-access/constants/url.class";
import {HBTTableHeader} from "@shared/component/hbt-table/hbt-table.interfaces";

@Component({
  selector: 'app-dependent-info',
  templateUrl: './dependent-info.component.html',
  styleUrls: ['./dependent-info.component.scss']
})
export class DependentInfoComponent extends BaseListComponent<any> implements OnInit {

  @Input() employeeId:string;
  functionCode: string = FunctionCode.ICN_CONFIG_PARAMETER;
  isCustomSearch=true;
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
      title: 'icn.icnContribution.calculate.employeeInfo.dependentInformation.numberOrder',
      field: 'numberOrder',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.dependentInformation.relationTypeName',
      field: 'relationTypeName',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.dependentInformation.fullName',
      field: 'fullName',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.dependentInformation.taxNumber',
      field: 'taxNumber',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.dependentInformation.startDate',
      field: 'startDate',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.dependentInformation.endDate',
      field: 'endDate',
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
    }
  ];

}

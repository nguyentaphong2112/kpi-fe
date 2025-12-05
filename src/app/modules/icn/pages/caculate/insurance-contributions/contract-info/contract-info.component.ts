import {Component, Input, OnInit} from '@angular/core';
import {FunctionCode} from "@shared/enums/enums-constant";
import {UrlConstant} from "@app/modules/icn/data-access/constants/url.class";
import {HBTTableHeader} from "@shared/component/hbt-table/hbt-table.interfaces";
import {BaseListComponent} from "@core/components/base-list.component";

@Component({
  selector: 'app-contract-info',
  templateUrl: './contract-info.component.html',
  styleUrls: ['./contract-info.component.scss']
})
export class ContractInfoComponent extends BaseListComponent<any> implements OnInit {

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
      title: 'icn.icnContribution.calculate.employeeInfo.contractInformation.startDate',
      field: 'startDate',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.contractInformation.endDate',
      field: 'endDate',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.contractInformation.contractTypeName',
      field: 'contractTypeName',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.contractInformation.duration',
      field: 'duration',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.contractInformation.empTypeName',
      field: 'empTypeName',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.contractInformation.armyRank',
      field: 'armyRank',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.contractInformation.documentNo',
      field: 'documentNo',
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

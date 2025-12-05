import {Component, Input, OnInit} from '@angular/core';
import {BaseListComponent} from "@core/components/base-list.component";
import {FunctionCode} from "@shared/enums/enums-constant";
import {UrlConstant} from "@app/modules/icn/data-access/constants/url.class";
import {HBTTableHeader} from "@shared/component/hbt-table/hbt-table.interfaces";

@Component({
  selector: 'app-ic-info',
  templateUrl: './ic-info.component.html',
  styleUrls: ['./ic-info.component.scss']
})
export class IcInfoComponent extends BaseListComponent<any> implements OnInit {

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
      title: 'icn.icnContribution.calculate.employeeInfo.insuranceCoefficientInformation.startDate',
      field: 'startDate',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.insuranceCoefficientInformation.endDate',
      field: 'endDate',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.insuranceCoefficientInformation.insuranceFactor',
      field: 'insuranceFactor',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.insuranceCoefficientInformation.insuranceBaseSalary',
      field: 'insuranceBaseSalary',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.insuranceCoefficientInformation.reserveFactor',
      field: 'reserveFactor',
      width: 120,
    },
    {
      title: 'icn.icnContribution.calculate.employeeInfo.insuranceCoefficientInformation.seniorityPercent',
      field: 'seniorityPercent',
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

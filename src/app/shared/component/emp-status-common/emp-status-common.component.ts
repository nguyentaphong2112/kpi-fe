import { Component, Input, OnInit } from '@angular/core';
import { Constant, ConstantColor } from '../../constant/common';

@Component({
  selector: 'app-emp-status-common',
  templateUrl: './emp-status-common.component.html',
  styleUrls: ['./emp-status-common.component.scss']
})
export class EmpStatusCommonComponent implements OnInit {
  tagIsWorkingColor: string = ConstantColor.TAG.STATUS_IS_WORKING;
  tagSuspenseColor: string = ConstantColor.TAG.STATUS_SUSPENSE;
  tagRetiredColor: string = ConstantColor.TAG.STATUS_RETIRED;
  constant = Constant;
  @Input() empStatus: number;

  constructor() {
  }

  ngOnInit(): void {
  }

  getEmpStatus(value: number) {
    return Constant.STATUSES_EMPLOYEE.find(status => status.value === value.toString())?.label;
  }
}

import {Component, Injector, Input, OnInit} from '@angular/core';
import {BaseFormComponent} from "@core/components/base-form.component";
import {UrlConstant} from "@shared/constant/url.class";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {HTTP_STATUS_CODE} from "@core/constant/system.constants";
import {SearchFormService} from "@app/modules/hrm/data-access/services/search-form.service";
import {EmployeesInfo} from "@app/modules/hrm/data-access/models/employee-info";
import {FunctionCode} from "@shared/enums/enums-constant";
import {
  PositionFormComponent
} from "@app/modules/hrm/pages/model-plan/organizations/position-form/position-form.component";


@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss']
})
export class EmployeeInfoComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  urlSearchData = UrlConstant.EMPLOYEES.PREFIX;
  isCustomSearch=true;
  employeeId:number;
  employeesInfo: EmployeesInfo | NzSafeAny;
  basicInfo:NzSafeAny;
  indexTab:any;

  constructor(
    injector:Injector,
    private readonly service:SearchFormService
  ) {
    super(injector)
    this.findOneById = () => this.service.findOneById(this.employeeId,this.urlSearchData);
    this.key = 'employeeId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.initPersonalInfo();
  }

  initPersonalInfo(){
    this.service.findOneById(this.employeeId,this.urlSearchData).subscribe(res=>{
      if(res.code ===  HTTP_STATUS_CODE.SUCCESS){
        this.employeesInfo = new EmployeesInfo.PersonalInfo(res.data);
        this.basicInfo = this.employeesInfo.getInfoByType('BASIC_INFO');
      }
    })
  }

  selectedIndexChange(index: number) {
    this.indexTab = index;
  }

}

import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { EmployeesService } from '@app/modules/hrm/data-access/services/staff-info/employees.service';

@Component({
  selector: 'app-pio-form',
  templateUrl: './pio-form.component.html',
  styleUrls: ['./pio-form.component.scss']
})
export class PioFormComponent extends BaseFormComponent<NzSafeAny> implements OnInit {

  urlLoadFamily = UrlConstant.CATEGORY.GET_LIST_FAMILY;
  urlLoadSelf = UrlConstant.CATEGORY.GET_LIST_SELF;
  serviceName = MICRO_SERVICE.ADMIN;
  employeeId: number;

  constructor(injector: Injector,
              private employeesService: EmployeesService,
              private dataService: DataService) {
    super(injector);
    this.findOneById = (id) => this.employeesService.findOneById(id, UrlConstant.POLITICAL_INFO.PREFIX);
    this.createApi = (body: NzSafeAny) => this.employeesService.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA, UrlConstant.POLITICAL_INFO.PREFIX);
    this.updateApi = (body: NzSafeAny) => this.employeesService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA, UrlConstant.POLITICAL_INFO.PREFIX);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'hr_employees',
      functionCode: Constant.FUNCTION_CODE.CTRI_XAHOI
    });
    this.key = 'employeeId';
    this.isPage = false;
    this.getConfigAttributes();
  }

  ngOnInit() {
    this.mode = Mode.EDIT;
    this.employeeId = this.route.snapshot.queryParams.employeeId;
    this.data.employeeId = this.employeeId;
    super.ngOnInit();
  }

  override initForm() {
    this.form = this.fb.group({
      familyPolicyId: [null],
      selfPolicyId: [null],
      partyNumber: [null],
      partyDate: [null],
      partyOfficialDate: [null],
      partyPlace: [null],
      listAttributes: this.fb.array([])
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

}

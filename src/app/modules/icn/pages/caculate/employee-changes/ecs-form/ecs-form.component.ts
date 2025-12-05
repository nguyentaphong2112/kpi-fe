import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {EmployeeChangesModel} from "../../../../data-access/models/caculate/employee-changes.model";
import {EmployeeChangesService} from "../../../../data-access/services/caculate/employee-changes.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {CATEGORY_CODE, REQUEST_TYPE} from "@shared/constant/common";

@Component({
  selector: 'ecs-form',
  templateUrl: './ecs-form.component.html',
  styleUrls: ['./ecs-form.component.scss']
})
export class EcsFormComponent extends BaseFormComponent<EmployeeChangesModel> implements OnInit {

  serviceName = MICRO_SERVICE.ICN
  urlLoadData = '/employee-changes'
  constructor(
    private readonly service: EmployeeChangesService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'employeeChangeId'
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: EmployeeChangesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: EmployeeChangesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      employeeChangeId: [null],
      employeeCode: [null],
      fullName: [null],
      changeType: [null],
      contributionType: [null],

    },
    {validators:
        []
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.initDataForm();
  }

  initDataForm() {
    if (this.data) {
      this.form.patchValue({
        employeeChangeId: this.data.employeeChangeId,
        employeeCode: this.data.employeeCode,
        fullName: this.data.fullName,
        changeType: this.data.changeType,
        contributionType: this.data.contributionType
      });
    }
    this.form.get('employeeCode').disable();
    this.form.get('fullName').disable();
    this.form.get('changeType').disable();
  }

  beforeSave() {
    super.beforeSave();
    const form = CommonUtils.convertDataSendToServer(this.form.value);
    const payload: any = {
      employeeChangeId: form.employeeChangeId,
      contributionType: form.contributionType
    };
    this.body = payload
  }

  protected readonly CATEGORY_CODE = CATEGORY_CODE;
  protected readonly MICRO_SERVICE = MICRO_SERVICE;
}



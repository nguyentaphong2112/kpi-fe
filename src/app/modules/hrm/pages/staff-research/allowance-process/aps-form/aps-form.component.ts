import {Component, Injector, OnInit} from '@angular/core';
import {BaseFormComponent} from '@core/components/base-form.component';
import {CommonUtils} from '@shared/services/common-utils.service';
import {Mode, REQUEST_TYPE} from '@shared/constant/common';
import {FormArray, Validators} from '@angular/forms';
import {DateValidator} from '@shared/custom-validator/dateValidator.class';
import {AllowanceProcessModel} from '@app/modules/hrm/data-access/models/research/allowance-process.model';
import {AllowanceProcessService} from '@app/modules/hrm/data-access/services/staff-research/allowance-process.service';
import {DataService} from '@shared/services/data.service';
import {FunctionCode} from '@app/shared/enums/enums-constant';
import {Scopes} from '@app/core/utils/common-constants';

@Component({
  selector: 'app-aps-form',
  templateUrl: './aps-form.component.html',
  styleUrls: ['./aps-form.component.scss']
})
export class ApsFormComponent extends BaseFormComponent<AllowanceProcessModel> implements OnInit {
  hiddenEmp = false;
  employeeId: number;
  functionCode = FunctionCode.HR_ALLOWANCE_PROCESS;
  scope = Scopes.CREATE;

  constructor(
    private readonly service: AllowanceProcessService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.initForm();
    this.key = 'allowanceProcessId';
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: AllowanceProcessModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: AllowanceProcessModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({ tableName: 'hr_allowance_process' });
    this.getConfigAttributes();
  }

  ngOnInit() {
    super.ngOnInit();
    this.employeeId = this.data?.employeeId;
    if (this.employeeId && this.mode === Mode.ADD) {
      this.form.controls.employeeId.setValue(this.employeeId);
    }
    this.hiddenEmp = this.data.hiddenEmp;
  }

  initForm() {
    this.form = this.fb.group({
      employeeId: [null],
      allowanceProcessId: [null],
      startDate: [null, [Validators.required]],
      endDate: [null],
      allowanceTypeId: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      documentNo: [null],
      documentSignedDate: [null],
      listAttributes: this.fb.array([])
    }, {
      validators: [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
    });

    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

}

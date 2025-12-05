import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { EducationProcessModel } from '@app/modules/hrm/data-access/models/research/education-process.model';
import { EducationProcessService } from '@app/modules/hrm/data-access/services/staff-research/education-process.service';
import { DataService } from '@shared/services/data.service';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { Utils } from '@core/utils/utils';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { Scopes } from '@app/core/utils/common-constants';
import { SYSTEM_FORMAT_DATA } from '@core/constant/system.constants';

@Component({
  selector: 'app-eps-form',
  templateUrl: './eps-form.component.html',
  styleUrls: ['./eps-form.component.scss']
})
export class EpsFormComponent extends BaseFormComponent<EducationProcessModel> implements OnInit {
  hiddenEmp = false;
  data: any;
  employeeId: number;
  functionCode = FunctionCode.HR_EDUCATION_PROCESS;
  scope = Scopes.CREATE;

  constructor(
    private readonly service: EducationProcessService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'educationProcessId';
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: EducationProcessModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: EducationProcessModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({tableName: 'hr_education_process'});
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

  override initForm() {
    this.form = this.fb.group({
      educationProcessId: [null],
      startDate: [null, [Validators.required]],
      endDate: [null],
      employeeId: [null, [Validators.required]],
      courseName: [null, [Validators.required, Validators.maxLength(255)]],
      trainingMethodId: [null],
      courseContent: [null],
      trainingMethodPlace: [null],
      listAttributes: this.fb.array([])
    }, {
      validators: [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
    });

    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  beforePatchValue() {
    this.data.startDate = Utils.convertDateToFillForm(this.data.startDate, SYSTEM_FORMAT_DATA.MONTH_TIME_FORMAT);
    this.data.endDate = Utils.convertDateToFillForm(this.data.endDate, SYSTEM_FORMAT_DATA.MONTH_TIME_FORMAT);
  }
}


import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { WorkedHistoriesModel } from '@app/modules/hrm/data-access/models/research/worked-histories.model';
import { WorkedHistoriesService } from '@app/modules/hrm/data-access/services/staff-research/worked-histories.service';
import { Utils } from '@core/utils/utils';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { Scopes } from '@app/core/utils/common-constants';

@Component({
  selector: 'app-why-form',
  templateUrl: './why-form.component.html',
  styleUrls: ['./why-form.component.scss']
})
export class WhyFormComponent extends BaseFormComponent<WorkedHistoriesModel> implements OnInit {

  hiddenEmp = false;
  data: any;
  employeeId: number;
  functionCode = FunctionCode.HR_WORKED_HISTORIES;
  scope = Scopes.CREATE;

  constructor(
    private readonly service: WorkedHistoriesService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'workedHistoryId';
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: WorkedHistoriesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: WorkedHistoriesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({ tableName: 'hr_worked_histories' });
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
      workedHistoryId: [null],
      employeeId: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      job: [null, [Validators.required, Validators.maxLength(255)]],
      companyName: [null, [Validators.required, Validators.maxLength(255)]],
      referenceName: [null, [Validators.maxLength(255)]],
      referenceJob: [null, [Validators.maxLength(255)]],
      listAttributes: this.fb.array([])
    }, {validators:
        [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
    });

    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  patchValueInfo() {
    this.form.patchValue(this.data);
    this.f.startDate.setValue(Utils.convertDateToFillForm(this.data.startDate, 'MM/yyyy'));
    this.f.endDate.setValue(Utils.convertDateToFillForm(this.data.endDate, 'MM/yyyy'));
  }
}

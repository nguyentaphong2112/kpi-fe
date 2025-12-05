import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { EvaluationPeriodsModel } from '../../../../data-access/models/kpi-managers/evaluation-periods.model';
import { EvaluationPeriodsService } from '../../../../data-access/services/kpi-managers/evaluation-periods.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { Utils } from '@core/utils/utils';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'eps-form',
  templateUrl: './eps-form.component.html',
  styleUrls: ['./eps-form.component.scss']
})
export class EpsFormComponent extends BaseFormComponent<EvaluationPeriodsModel> implements OnInit {

  serviceName = MICRO_SERVICE.KPI;
  urlLoadData = '/evaluation-periods';

  constructor(
    private readonly service: EvaluationPeriodsService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'evaluationPeriodId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: EvaluationPeriodsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: EvaluationPeriodsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'kpi_evaluation_periods'
    });
    this.getConfigAttributes();
  }

  override initForm() {
    this.form = this.fb.group({
        evaluationPeriodId: [null],
        year: [null, [Validators.required]],
        name: [null, [Validators.required, Validators.maxLength(255)]],
        startDate: [null, [Validators.required]],
        endDate: [null, [Validators.required]],
        listAttributes: this.fb.array([]),
        evaluationType: [null, [Validators.required]]
      },
      {
        validators:
          [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
      });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  afterPatchValue() {
    super.afterPatchValue();
    this.f.year.patchValue(Utils.convertDateToFillForm(this.data?.year, 'yyyy'));
  }

  override beforeSave() {
    this.body.year = Utils.convertDateToSendServer(this.f.year.value, 'yyyy');
  }
}




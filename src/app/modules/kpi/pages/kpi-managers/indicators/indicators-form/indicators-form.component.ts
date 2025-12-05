import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { IndicatorsModel } from '../../../../data-access/models/kpi-managers/indicators.model';
import { IndicatorsService } from '../../../../data-access/services/kpi-managers/indicators.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { Scopes } from '@core/utils/common-constants';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { distinctUntilChanged } from 'rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CustomValidators } from '@core/utils/custom-validations';

@Component({
  selector: 'indicators-form',
  templateUrl: './indicators-form.component.html',
  styleUrls: ['./indicators-form.component.scss']
})
export class IndicatorsFormComponent extends BaseFormComponent<IndicatorsModel> implements OnInit {
  scope = Scopes.VIEW;
  functionCode = Constant.FUNCTION_CODE.KPI_INDICATOR;
  serviceName = MICRO_SERVICE.KPI;
  urlLoadData = '/indicators';
  readonly FORM_ARRAY_NAME = 'listData';
  isShow = false;
  isSubmitted2 = false;

  constructor(
    private readonly service: IndicatorsService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'indicatorId';

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: IndicatorsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: IndicatorsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
  }

  ngOnInit() {
    super.ngOnInit();
    this.onChangeRatingType();
  }

  override initForm() {
    this.form = this.fb.group({
      indicatorId: [null],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      type: [null, [Validators.required, Validators.maxLength(255)]],
      unitId: [null, [Validators.required, Validators.maxLength(50)]],
      periodType: [null, [Validators.required, Validators.maxLength(50)]],
      significance: [null, [Validators.required, Validators.maxLength(1000)]],
      measurement: [null, [Validators.required, Validators.maxLength(255)]],
      systemInfo: [null, [Validators.required, Validators.maxLength(255)]],
      orgIds: [null],
      indicatorIds: [null],
      ratingType: ['NUMBER', [Validators.required]],
      listData: this.fb.array([]),
      note: [null, [Validators.maxLength(1000)]]
    }, {
      validators: [CustomValidators.formArrayValidator('listData', ['value'], 'value')]
    });
  }

  get formArray(): NzSafeAny {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }


  initArray(value = null) {
    const controlsConfig: any = {};
    controlsConfig.value = [value, [Validators.required]];
    const profile = this.fb.group(controlsConfig);
    this.formArray.push(profile);
  }

  addQuery(index: number) {
    this.formArray.at(index).get('value').setValidators([Validators.required]);
    this.formArray.at(index).get('value').updateValueAndValidity();
    this.isSubmitted2 = true;
    if (this.formArray.valid) {
      this.initArray();
      this.isSubmitted2 = false;
    }
  }

  removeQuery(index: number) {
    this.popupService.showModalConfirmDelete(() => {
      this.formArray.removeAt(index);
    });
  }


  onChangeRatingType() {
    this.subscriptions.push(
      this.f.ratingType.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
        this.isShow = value == 'SELECT';
        if (this.isShow && this.formArray.length == 0) {
          this.initArray();
        }
      })
    );
  }

  beforeSave() {
    super.beforeSave();
    if (!this.isShow) {
      while (this.formArray.length > 0) {
        this.formArray.removeAt(0);
      }
    } else {
      this.body.listValues = this.formArray.controls.map(it => it.get('value').value).join(';');
    }
  }

  beforePatchValue() {
    if (this.data.ratingType == 'SELECT') {
      this.data.listValues.split(';').forEach(it => {
        this.initArray(it);
      });
    }
    super.beforePatchValue();
  }

}



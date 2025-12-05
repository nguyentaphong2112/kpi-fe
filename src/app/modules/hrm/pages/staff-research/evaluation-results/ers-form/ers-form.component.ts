import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { EvaluationResultsModel } from '@app/modules/hrm/data-access/models/research/evaluation-results.model';
import { EvaluationResultsService } from '@app/modules/hrm/data-access/services/staff-research/evaluation-results.service';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { Utils } from '@core/utils/utils';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { Scopes } from '@app/core/utils/common-constants';
import { CategoryModel } from '@core/models/category-common.interface';
import { distinctUntilChanged } from 'rxjs';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { StringUtils } from '@app/shared/utils/string-utils.class';

@Component({
  selector: 'app-ers-form',
  templateUrl: './ers-form.component.html',
  styleUrls: ['./ers-form.component.scss']
})
export class ErsFormComponent extends BaseFormComponent<EvaluationResultsModel> implements OnInit {
  urlConstant = UrlConstant;
  hiddenEmp = false;
  employeeId: number;
  functionCode = FunctionCode.HR_EVALUATION_RESULTS;
  scope = Scopes.CREATE;
  listEvaluationPeriod: CategoryModel[] = [];
  listEvaluationType: CategoryModel[] = [];
  listKpiResult: CategoryModel[] = [];
  isRequiredKpiPoint = false;

  constructor(
    private readonly service: EvaluationResultsService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'evaluationResultId';
    this.getListEvaluationType();
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: EvaluationResultsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: EvaluationResultsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({tableName: 'hr_evaluation_results'});
    this.getConfigAttributes();
  }

  ngOnInit() {
    super.ngOnInit();
    this.employeeId = this.data?.employeeId;
    if (this.employeeId && this.mode === Mode.ADD) {
      this.form.controls.employeeId.setValue(this.employeeId);
    }
    this.hiddenEmp = this.data.hiddenEmp;
    this.subChangeValueYear();
    this.subChangeEvaluationType();
  }

  override initForm() {
    this.form = this.fb.group({
      employeeId: [null, [Validators.required]],
      evaluationResultId: [null],
      year: [null, [Validators.required]],
      evaluationPeriodId: [null, [Validators.required]],
      evaluationType: [null, [Validators.required]],
      kpiPoint: [null],
      kpiResult: [null, [Validators.required, Validators.maxLength(50)]],
      note: [null],
      listAttributes: this.fb.array([])
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  subChangeValueYear() {
    this.subscriptions.push(
      this.f.year.valueChanges.pipe(distinctUntilChanged()).subscribe(year => {
        if (year && this.f.evaluationType.value) {
          const params = {
            year: Utils.convertDateToSendServer(year, 'yyyy'),
            evaluationType: this.f.evaluationType.value
          }
          this.getListEvaluationPeriod(params);
        } else {
          this.listEvaluationPeriod = [];
          this.f.evaluationPeriodId.reset();
        }
      })
    )
  }

  subChangeEvaluationType() {
    this.subscriptions.push(
      this.f.evaluationType.valueChanges.pipe(distinctUntilChanged()).subscribe(evaluationType => {
        if (evaluationType && this.f.year.value) {
          const params = {
            year: Utils.convertDateToSendServer(this.f.year.value, 'yyyy'),
            evaluationType: evaluationType
          }
          this.getListEvaluationPeriod(params);
        } else {
          this.listEvaluationPeriod = [];
          this.f.evaluationPeriodId.reset();
        }
      })
    );
  }

  getListEvaluationPeriod(params: any) {
    this.dataService.getDataByParam(this.urlConstant.GET_EVALUATION_PERIODS, params, MICRO_SERVICE.HRM).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listEvaluationPeriod = res.data;
        if (!this.listEvaluationPeriod.some((item: any) => item.evaluationPeriodId === this.f.evaluationPeriodId.value)) {
          this.f.evaluationPeriodId.reset();
        }
      }
    })
  }

  changeEvaluationType(typeValue: string) {
    const data: any = this.listEvaluationType.find(item => item.value === typeValue);
    if (data?.attributes?.['KET_QUA']) {
      this.listKpiResult = data.attributes['KET_QUA'].split(',')
        .reduce((acc: { name: string }[], item: string) => {
          if (!StringUtils.isNullOrEmpty(item)) {
            acc.push({ name: item.trim() });
          }
          return acc;
        }, []) ?? [];

      if (!this.listKpiResult.some(item => item.name === this.f.kpiResult.value)) {
        this.f.kpiResult.reset();
      }
    } else {
      this.listKpiResult = [];
      this.f.kpiResult.reset();
    }

    this.isRequiredKpiPoint = data?.attributes?.['BAT_BUOC_NHAP_DIEM'] === 'Y';
    this.f.kpiPoint.setValidators(this.isRequiredKpiPoint ? [Validators.required] : null);
    this.f.kpiPoint.updateValueAndValidity();
  }

  getListEvaluationType() {
    this.subscriptions.push(
      this.dataService.getDataByParam(this.getUrlCategory(this.categoryCode.KPI_LOAI_DANH_GIA), {isGetAttribute: true}, MICRO_SERVICE.ADMIN).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listEvaluationType = res.data;
        }
      })
    )
  }

  beforeSave() {
    this.body.year = Utils.convertDateToSendServer(this.f.year.value, 'yyyy');
  }

  patchValueInfo() {
    this.data.year = Utils.convertDateToFillForm(this.data.year, 'yyyy');
    this.form.patchValue(this.data);
    this.afterPatchValue();
  }
}

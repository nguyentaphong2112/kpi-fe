import { ChangeDetectorRef, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import {
  IndicatorConversionsModel
} from '@app/modules/kpi/data-access/models/kpi-managers/indicator-conversions.model';
import {
  IndicatorConversionsService
} from '@app/modules/kpi/data-access/services/kpi-managers/indicator-conversions.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { ObjectUtil } from '@core/utils/object.util';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { CategoryModel } from '@core/models/category-common.interface';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CategoriesService } from '@app/modules/admin/data-access/services/categories/categories.service';
import { CatalogModel } from '@shared/model/catalog-model';
import { ValidationService } from '@shared/services/validation.service';
import {
  IndicatorsFormComponent
} from '@app/modules/kpi/pages/kpi-managers/indicators/indicators-form/indicators-form.component';
import { HbtDataPickerComponent } from '@shared/component/hbt-data-picker/hbt-data-picker.component';

@Component({
  selector: 'app-ics-add-form',
  templateUrl: './ics-add-form.component.html',
  styleUrls: ['./ics-add-form.component.scss']
})
export class IcsAddFormComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  listSign: CategoryModel[] = [];
  listSignMax: CategoryModel[] = [];
  listSignMin: CategoryModel[] = [];
  listConversionValue: CategoryModel[] = [];
  listRequired: CategoryModel[] = [];
  readonly FORM_ARRAY_NAME = 'conversions';
  listConversion: CatalogModel[] = [];
  listConversionSelected: CatalogModel[] = [];
  urlLoadData = UrlConstant.INDICATOR.DATA_PICKER;
  serviceName = MICRO_SERVICE.KPI;
  isHidden = true;
  periodTypeName = null;
  typeName = null;
  unitName = null;
  systemInfo = null;
  significance = null;
  measurement = null;
  isValueSelected = false;
  orgId = null;
  listValuesSelect = [];
  isSelected = false;
  listEqual = ObjectUtil.optionsToList([{ value: 'EQUAL', label: '=' }], this.translate);
  isLoadFirst = true;

  @ViewChild('footerTmpl', { static: true }) footerTpl!: TemplateRef<any>;
  @ViewChild(HbtDataPickerComponent) dataPickerComponent: HbtDataPickerComponent;


  constructor(
    private readonly service: IndicatorConversionsService,
    private categoryService: CategoriesService,
    private cdr: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
    this.key = 'indicatorConversionId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: IndicatorConversionsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: IndicatorConversionsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  ngOnInit() {
    this.orgId = this.data?.orgId;
    this.urlLoadData = this.urlLoadData + this.orgId;
    this.initForm();
    this.initDataSelect();
    this.initData();
    this.clearValidators();
  }

  initDataSelect() {
    this.listSign = ObjectUtil.optionsToList(Constant.LIST_SIGN, this.translate);
    this.listSignMax = ObjectUtil.optionsToList(Constant.LIST_SIGN_MAX, this.translate);
    this.listSignMin = ObjectUtil.optionsToList(Constant.LIST_SIGN_MIN, this.translate);
    this.listRequired = ObjectUtil.optionsToList(Constant.LIST_REQUIRED, this.translate);
    this.listConversionValue = ObjectUtil.optionsToList(Constant.CONVERSION_VALUE, this.translate);
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_THANG_DO)).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listConversion = res.data;
        this.listConversion.forEach((it) => {
          this.initConversions(it.value);
        });
      }
    });
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_DKY_MUC_TIEU_DON_VI)).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listConversionSelected = res.data;
      }
    });
  }

  override initForm() {
    this.form = this.fb.group({
      indicatorId: [null, Validators.required],
      note: [null],
      indicatorMasterId: [this.route.snapshot.queryParams.indicatorMasterId],
      conversionType: ['CA_NHAN', Validators.required],
      isRequired: ['N', Validators.required],
      conversions: this.fb.array([])
    });
  }

  get conversions(): NzSafeAny {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  doOpenForm() {
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth(),
      nzTitle: this.getModeTitle(this.modeConst.ADD) + this.translate.instant('kpi.indicators.table.title'),
      nzContent: IndicatorsFormComponent,
      nzComponentParams: {
        mode: this.modeConst.ADD
      },
      nzFooter: this.footerTpl
    });
    this.modalRef.afterClose.subscribe((result) => {
        if (result?.refresh) {
          this.dataPickerComponent.onInputChange;
        }
      }
    );

  }

  changeInput($event) {
    this.isValueSelected = $event === 'DON_VI';

    this.listConversion.forEach((item, index) => {
      const controlGroup = this.conversions.at(index);
      if (this.isValueSelected) {
        controlGroup.setValidators([
          ValidationService.minValueAndComparisonValidator(),
          ValidationService.maxValueAndComparisonValidator()
        ]);
      } else {
        controlGroup.setValidators([
          ValidationService.maxGreaterThanMinValidator(),
          ValidationService.minValueAndComparisonValidator(),
          ValidationService.maxValueAndComparisonValidator()
        ]);
      }
      controlGroup.patchValue({
        maxValue: null,
        maxComparison: null,
        minValue: null,
        minComparison: null
      });

      controlGroup.updateValueAndValidity();
    });
  }

  initConversions(resultId: any) {
    const controlsConfig: any = {};
    controlsConfig.maxValue = [null];
    controlsConfig.maxComparison = [null];
    controlsConfig.resultId = [resultId];
    controlsConfig.minValue = [null];
    controlsConfig.minComparison = [null];
    controlsConfig.note = [null];
    const profile = this.fb.group(controlsConfig, {
      validators: [ValidationService.maxGreaterThanMinValidator(),
        ValidationService.minValueAndComparisonValidator(),
        ValidationService.maxValueAndComparisonValidator()]
    });
    this.conversions.push(profile);
  }

  beforeSave() {
    this.body.conversions.forEach(it => {
      if (it.minComparison === 'LESS_THAN' || it.minComparison === 'LESS_THAN_EQUAL') {
        it.maxComparison = it.minComparison;
        it.minComparison = null;
        it.maxValue = it.minValue;
        it.minValue = null;
      }
    });
    this.body.orgTypeId = this.route.snapshot.queryParams?.orgTypeId;
    this.body.jobId = this.route.snapshot.queryParams?.jobId;
    this.body.organizationId = this.route.snapshot.queryParams?.organizationId;
  }

  override patchValueInfo() {
    this.form.controls['conversionType'].setValue(this.data?.conversionType ?? 'CA_NHAN');
    if (this.data?.ratingType == 'SELECT') {
      this.listValuesSelect = this.data.listValues.split(';').map(it => ({
        label: it,
        value: it
      }));
      this.resetConversionsValues();
      this.isSelected = true;
    }
    setTimeout(() => {
      if (this.data?.conversions) {
        this.data.conversions.map(item => {
          const index = this.conversions.controls.findIndex(control => control.value.resultId == item.resultId);
          if (index !== -1) {
            let minValue = item.minValue;
            let maxValue = item.maxValue;
            if (this.data?.conversionType == 'DON_VI') {
              minValue = item.minValue?.toString();
              maxValue = item.maxValue?.toString();
            }

            this.conversions.at(index).patchValue({
              maxValue: index == 0 || index == 4 ? null : maxValue,
              maxComparison: index == 0 || index == 4 ? null : item.maxComparison,
              minValue: index == 0 || index == 4 ? minValue ?? maxValue : minValue,
              minComparison: index == 0 || index == 4 ? item.minComparison ?? item.maxComparison : item.minComparison,
              note: item.note ?? ''
            });
          }
        });
      }
      this.cdr.detectChanges();
      setTimeout(() => {
        delete this.data?.conversionType;
        delete this.data.conversions;
        if (this.data) {
          this.form.patchValue(this.data);
        }
        this.afterPatchValue();
      });
    });
  }

  override afterPatchValue() {
    super.afterPatchValue();
    this.typeName = this.data.typeName;
    this.periodTypeName = this.data.periodTypeName;
    this.unitName = this.data.unitName;
    this.systemInfo = this.data.systemInfo;
    this.significance = this.data.significance;
    this.measurement = this.data.measurement;
    this.isHidden = false;
  }

  loadData($event) {
    if (!this.isLoadFirst || this.mode == this.modeConst.ADD) {
      if ($event?.itemSelected) {
        this.typeName = $event?.itemSelected.typeName;
        this.periodTypeName = $event?.itemSelected.periodTypeName;
        this.unitName = $event?.itemSelected.unitName;
        this.systemInfo = $event?.itemSelected.systemInfo;
        this.significance = $event?.itemSelected.significance;
        this.measurement = $event?.itemSelected.measurement;
        if ($event?.itemSelected.ratingType == 'SELECT') {
          this.listValuesSelect = $event?.itemSelected.listValues.split(';').map(it => ({
            label: it,
            value: it
          }));
          this.isSelected = true;
          this.resetConversionsValues();
        } else {
          this.listValuesSelect = [];
          this.isSelected = false;
          this.resetConversionsValues();
        }
        this.isHidden = false;
      } else {
        if (!$event?.listOfSelected) {
          this.typeName = null;
          this.periodTypeName = null;
          this.unitName = null;
          this.systemInfo = null;
          this.significance = null;
          this.measurement = null;
          this.isHidden = true;
          this.listValuesSelect = [];
          this.isSelected = false;
          this.resetConversionsValues();
        }
      }
    }
    this.isLoadFirst = false;
  }

  resetConversionsValues(data?: NzSafeAny) {
    const resetValues = this.conversions.controls.map(() => ({
      maxValue: data ? data.maxValue : null,
      minValue: data ? data.minValue : null,
      maxComparison: data ? data.maxComparison : null,
      minComparison: data ? data.minComparison : null,
      note: data ? data.note : null
    }));

    this.conversions.patchValue(resetValues);
  }

}

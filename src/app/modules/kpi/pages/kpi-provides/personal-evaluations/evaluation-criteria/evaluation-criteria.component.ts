import { Component, Injector, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { BaseFormComponent } from '@core/components/base-form.component';
import {
  OrganizationEvaluationsModel
} from '@app/modules/kpi/data-access/models/kpi-evaluations/organization-evaluations.model';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { CategoriesService } from '@app/modules/admin/data-access/services/categories/categories.service';
import { IndicatorsService } from '@app/modules/kpi/data-access/services/kpi-managers/indicators.service';
import {
  totalPercentValidator
} from '@app/modules/kpi/pages/kpi-evaluations/employee-evaluations/evaluation-criteria/evaluation-criteria.component';

import {
  PersonalEvaluationsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/personal-evaluations.service';
import {
  IndicatorPopupComponent
} from '@app/modules/kpi/pages/kpi-provides/employee-evaluations/indicator-popup/indicator-popup.component';
import {
  ViewIndicatorComponent
} from '@app/modules/kpi/pages/kpi-provides/employee-evaluations/view-indicator/view-indicator.component';

@Component({
  selector: 'emp-evaluation-criteria',
  templateUrl: './evaluation-criteria.component.html',
  styleUrls: ['./evaluation-criteria.component.scss']
})
export class EvaluationCriteriaComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  readonly FORM_ARRAY_NAME = 'employeeIndicatorList';
  actionSchema: ActionSchema;
  // listDataSelect = [];
  listConversion = [];
  isDetail = false;
  dataAdd = null;
  isAdjust = false;
  isVisible = false;
  valueInput = '';
  isSubmittedModal = false;
  adjustReason = '';
  isEvaluate = false;

  @Input() dataValid: any;
  @ViewChild('footerTmpl', { static: true }) footerTpl!: TemplateRef<any>;
  @ViewChild('footerCancelTmpl', { static: true }) footerCancelTpl!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: PersonalEvaluationsService,
    private categoryService: CategoriesService
  ) {
    super(injector);
    this.mode = Mode.EDIT;
    this.isDetail = this.route.snapshot.queryParams.isDetail;
    this.isAdjust = this.route.snapshot.queryParams.isAdjust;
    this.isEvaluate = this.route.snapshot.queryParams.isEvaluate;
    this.isPage = true;
    this.initAction();
    this.initDataSelect();
    this.findOneById = (id) => this.service.findOneById(id, UrlConstant.EMPLOYEE_EVALUATION.INDICATOR);
    this.createApi = (body: OrganizationEvaluationsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA, UrlConstant.EMPLOYEE_EVALUATION.INDICATOR);
    this.updateApi = (body: OrganizationEvaluationsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA, UrlConstant.EMPLOYEE_EVALUATION.INDICATOR);
    this.key = 'employeeEvaluationId';
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.dataValid.adjust) {
      this.isDetail = true;
    }
  }


  addData($event) {
    if ($event) {
      if (this.formArray.at(this.formArray.length - 1).get('indicatorConversionId').value == null) {
        this.formArray.at(this.formArray.length - 1).get('indicatorConversionId').setValue($event);
      } else {
        this.addNew();
        if (!this.isSubmitted) {
          this.formArray.at(this.formArray.length - 1).get('indicatorConversionId').setValue($event);
        }
      }
      setTimeout(() => {
        this.dataAdd = null;
      });
    }
  }


  patchValue() {
    this.service.findOneById(this.route.snapshot.queryParams.employeeEvaluationId, UrlConstant.EMPLOYEE_EVALUATION.INDICATOR).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.adjustReason = res.data.adjustReason;
        if (res.data.listData && res.data.listData.length > 0) {
          res.data.listData.forEach((it, index) => {
            this.initFormArray();
            this.formArray.at(index).patchValue({
              employeeIndicatorId: it.employeeIndicatorId || null,
              indicatorConversionId: it.indicatorConversionId || null,
              indicatorId: it.indicatorId || null,
              indicatorName: it.indicatorName || null,
              measureUnit: it.unitName || null,
              periodTypeName: it.periodTypeName || null,
              typeName: it.typeName || null,
              significance: it.significance || null,
              measurement: it.measurement || null,
              systemInfo: it.systemInfo || null,
              relatedNames: it.relatedNames || null,
              scopeNames: it.scopeNames || null,
              note: it.note || null,
              percent: it.percent,
              target: it.target || null,
              result: it.result || null,
              oldPercent: it.oldPercent || null,
              dataSelect: it?.listValues?.split(';').map(it => ({
                label: it,
                value: it
              })) || null,
              isSelected: it.ratingType == 'SELECT' && it.conversionType != 'DON_VI'
            });
            it.conversions.forEach((item: any) => {
              this.formArray.at(index).get(item.resultId).setValue(item.expression);
            });
          });
        }
      }
    });
  }


  openIndicatorDetail(data: any) {
    this.modalRef = this.modal.create({
      nzWidth: window.innerWidth / 1.2 > 1500 ? 1500 : window.innerWidth / 1.2,
      nzTitle: this.translate.instant('kpi.employeeEvaluations.label.viewIndicator'),
      nzContent: ViewIndicatorComponent,
      nzComponentParams: {
        mode: this.modeConst.VIEW,
        data: data
      },
      nzFooter: this.footerCancelTpl
    });
  }

  getTotalPercent(): number {
    const totalPoint = this.formArray.controls.reduce((sum, item) =>
      sum + (parseFloat(item.get('percent')?.value ? item.get('percent')?.value : 0)), 0
    );
    return parseFloat(totalPoint.toFixed(2));
  }

  override initForm() {
    this.form = this.fb.group({
      employeeIndicatorList: this.fb.array([], totalPercentValidator('percent')),
      isEvaluate: [this.isEvaluate ? 'Y' : null],
      adjustReason: [null]
    });
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.add',
          icon: 'plus-circle',
          function: () => {
            return this.openIndicatorPopup();
          }
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          function: this.onDelete
        })
      ]
    });
  }


  openModal() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.valueInput = this.adjustReason;
      this.isVisible = true;
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isSubmittedModal = false;
  }

  handleOk(): void {
    this.isSubmittedModal = true;
    if (this.valueInput) {
      this.f.adjustReason.setValue(this.valueInput);
      this.save();
    }
  }

  initDataSelect() {
    // this.indicatorService.getList(null, UrlConstant.INDICATOR.GET_LIST_EMPLOYEE + this.route.snapshot.queryParams.employeeId).subscribe(res => {
    //   if (res.code === HTTP_STATUS_CODE.SUCCESS) {
    //     this.listDataSelect = res.data;
    //   }
    // });
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_THANG_DO)).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listConversion = res.data;
        this.patchValue();
      }
    });
  }

  openIndicatorPopup() {
    this.modalRef = this.modal.create({
      nzWidth: window.innerWidth / 1.2 > 1500 ? 1500 : window.innerWidth / 1.2,
      nzTitle: this.translate.instant('kpi.employeeEvaluations.label.selectedIndicator'),
      nzContent: IndicatorPopupComponent,
      nzComponentParams: {
        mode: this.modeConst.ADD,
        data: this.formArray.controls.map(it => it.get('indicatorConversionId').value),
        isEmp: true
      },
      nzFooter: this.footerTpl
    });
    this.modalRef.afterClose.subscribe((result) => {
        if (result?.data) {
          this.patchValue2(result?.data);
        }
      if (result?.idsDelete) {
        result?.idsDelete.forEach(id => {
          const idDelete = this.formArray.controls.findIndex(it => it.value.indicatorConversionId == id);
          this.formArray.removeAt(idDelete);
        });
      }
      }
    );
  }

  patchValue2(data) {
    if (data && data.length > 0) {
      data.forEach(it => {
        this.initFormArray();
        this.formArray.at(this.formArray.length - 1).patchValue({
          employeeIndicatorId: it.employeeIndicatorId || null,
          indicatorConversionId: it.indicatorConversionId || null,
          indicatorId: it.indicatorId || null,
          indicatorName: it.indicatorName || null,
          measureUnit: it.unitName || null,
          relatedNames: it.relatedNames || null,
          scopeNames: it.scopeNames || null,
          periodTypeName: it.periodTypeName || null,
          significance: it.significance || null,
          measurement: it.measurement || null,
          systemInfo: it.systemInfo || null,
          note: it.note || null,
          typeName: it.typeName || null,
          dataSelect: it?.listValues?.split(';').map(it => ({
            label: it,
            value: it
          })) || null,
          isSelected: it.ratingType == 'SELECT' && it.conversionType != 'DON_VI'
        });
        it.conversions.forEach((item: any) => {
          this.formArray.at(this.formArray.length - 1).get(item.resultId).setValue(item.expression);
        });
      });
    }
  }

  strReplaceSpace(str: any) {
    return str.replace(/\s/g, ' ');
  }

  initFormArray() {
    const controlsConfig: any = {};
    controlsConfig.employeeIndicatorId = [null];
    controlsConfig.employeeEvaluationId = [this.route.snapshot.queryParams.employeeEvaluationId];
    controlsConfig.indicatorName = [null];
    controlsConfig.indicatorId = [null];
    controlsConfig.measureUnit = [null];
    controlsConfig.oldPercent = [null];
    controlsConfig.typeName = [null];
    controlsConfig.periodTypeName = [null];
    controlsConfig.relatedNames = [null];
    controlsConfig.scopeNames = [null];
    controlsConfig.significance = [null];
    controlsConfig.measurement = [null];
    controlsConfig.note = [null];
    controlsConfig.systemInfo = [null];
    controlsConfig.result = [null, this.isEvaluate ? [Validators.required] : []];
    controlsConfig.indicatorConversionId = [null, [Validators.required]];
    controlsConfig.percent = [null, [Validators.required]];
    controlsConfig.target = [null, [Validators.required]];
    controlsConfig.dataSelect = [null];
    controlsConfig.isSelected = [null];
    this.listConversion.forEach((column: any) => {
      controlsConfig[column.value] = [null];
    });
    const profile = this.fb.group(controlsConfig);
    this.formArray.push(profile);
  }

  get formArray(): FormArray {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  getValueSelect(data: any, value: any, keyValue = 'value', keyLabel = 'label') {
    return data.find(it => it[keyValue] == value) ? data.find(it => it[keyValue] == value)[keyLabel] : '-';
  }

  addNew = () => {
    this.isSubmitted = true;
    if (this.formArray.valid) {
      this.initFormArray();
      this.isSubmitted = false;
    }
  };


  onDelete = (item: FormGroup) => {
    this.formArray.removeAt(item['key']);
    // if (this.formArray.length === 0) {
    //   this.initFormArray();
    // }
    // this.listDataSelect.forEach((item, i) => {
    //   if (!this.formArray.value.some((it: any) => it.indicatorConversionId === item.indicatorConversionId)) {
    //     this.listDataSelect[i].disable = false;
    //   }
    // });
  };

  // getData($event, index: number) {
  //   const data = $event.itemSelected ?? null;
  //   this.formArray.at(index).get('measureUnit').setValue(data?.unitName);
  //   this.formArray.at(index).get('indicatorId').setValue(data?.indicatorId);
  //   if (data?.conversions) {
  //     data.conversions.forEach((item: any) => {
  //       this.formArray.at(index).get(item.resultId).setValue(item.expression);
  //     });
  //   } else {
  //     this.listConversion.forEach((column: any) => {
  //       this.formArray.at(index).get(column.value).setValue(null);
  //     });
  //   }
  //   const indexData = this.listDataSelect.findIndex(item => item.indicatorConversionId == data?.indicatorConversionId);
  //   this.listDataSelect.forEach((item, i) => {
  //     if (indexData != null && indexData === i) {
  //       this.listDataSelect[i].disable = true;
  //     } else if (!this.formArray.value.some((it: any) => it.indicatorConversionId === item.indicatorConversionId)) {
  //       this.listDataSelect[i].disable = false;
  //     }
  //   });
  // }

  beforeSave() {
    this.body['id'] = this.route.snapshot.queryParams.employeeEvaluationId;
  }

}

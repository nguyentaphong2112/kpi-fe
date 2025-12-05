import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
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
  IndicatorPopupComponent
} from '@app/modules/kpi/pages/kpi-evaluations/employee-evaluations/indicator-popup/indicator-popup.component';
import {
  PersonalEvaluationsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/personal-evaluations.service';
import { distinctUntilChanged, Subscription } from 'rxjs';
import {
  AlertModalChangeService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/alert-modal-change.service';

@Component({
  selector: 'emp-evaluation-criteria',
  templateUrl: './evaluation-criteria.component.html',
  styleUrls: ['./evaluation-criteria.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluationCriteriaComponent extends BaseFormComponent<NzSafeAny> implements OnInit, OnDestroy {
  readonly FORM_ARRAY_NAME = 'employeeIndicatorList';
  actionSchema: ActionSchema;
  // listDataSelect = [];
  listConversion = [];
  isDetail = false;
  dataAdd = null;
  isEvaluateDetail = false;
  isVisible = false;
  valueInput = '';
  isSubmittedModal = false;
  adjustReason = '';
  isEvaluate = false;
  isEvaluateManage = false;
  private closeAlertModalSubscription: Subscription;
  result = null;

  @Input() dataValid: any;
  @ViewChild('footerTmpl', { static: true }) footerTpl!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: PersonalEvaluationsService,
    private categoryService: CategoriesService,
    private alertModalChangeService: AlertModalChangeService
  ) {
    super(injector);
    this.mode = Mode.EDIT;
    this.isDetail = this.route.snapshot.queryParams.isDetail;
    this.isEvaluateDetail = this.route.snapshot.queryParams.isEvaluateDetail;
    this.isEvaluate = this.route.snapshot.queryParams.isEvaluate;
    this.isEvaluateManage = this.route.snapshot.queryParams.isEvaluateManage;
    this.isPage = true;
    this.initAction();
    this.initDataSelect();
    this.findOneById = (id) => this.service.findOneById(id, UrlConstant.EMPLOYEE_EVALUATION.INDICATOR);
    this.createApi = (body: OrganizationEvaluationsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA, UrlConstant.EMPLOYEE_EVALUATION.INDICATOR);
    this.updateApi = (body: OrganizationEvaluationsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA, UrlConstant.EMPLOYEE_EVALUATION.INDICATOR);
    this.key = 'employeeEvaluationId';
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

  ngOnInit() {
    super.ngOnInit();
    this.onListener();
  }

  onListener() {
    if (!this.isEvaluateDetail) {
      this.closeAlertModalSubscription = this.alertModalChangeService.saveValue$.subscribe((res: any) => {
        this.result = res;
        this.formArray.controls.forEach(it => {
          if (it.get('isWorkPlanningIndex').value == 'Y' && it.get('isOrg').value == 'N') {
            it.get(this.isEvaluateManage ? 'resultManage' : 'result').setValue(!isNaN(res) ? Number(res.toFixed(2)) : null);
            this.ref.detectChanges();
          }
        });
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
            it.conversions.forEach((item: any) => {
              this.formArray.at(index).get(item.resultId).setValue(item.expression);
            });
            this.formArray.at(index).patchValue({
              dataSelect: it?.listValues?.split(';').map(it => ({
                label: it,
                value: it
              })) || null,
              isSelected: it.ratingType == 'SELECT' && it.conversionType != 'DON_VI',
              isPercent: it.ratingType == 'PERCENT',
              employeeIndicatorId: it.employeeIndicatorId || null,
              indicatorConversionId: it.indicatorConversionId || null,
              indicatorId: it.indicatorId || null,
              indicatorName: it.indicatorName || null,
              measureUnit: it.unitName || null,
              percent: it.percent,
              target: it.target || null,
              isFocusReduction: it.isFocusReduction || null,
              result: (it.isOrg == 'N' || it.isHead == 'N' || this.isEvaluateDetail) ? it.result : it.resultOrg,
              resultManage: (it.isOrg == 'N' || it.isHead == 'N' || this.isEvaluateDetail) ? (it.resultManage || (this.isEvaluateManage ? it.result : null)) : (it.resultManageOrg || (this.isEvaluateManage ? it.resultOrg : null)),
              oldPercent: it.oldPercent || null,
              isWorkPlanningIndex: it.isWorkPlanningIndex || null,
              isOrg: it.isOrg,
              isHead: it.isHead,
              targetStr: it.targetStr
            });
            if (it.isWorkPlanningIndex == 'Y' && it.isOrg == 'N' && !this.isEvaluateDetail) {
              this.formArray.at(index).get(this.isEvaluateManage ? 'resultManage' : 'result').setValue(!isNaN(this.result) ? Number(this.result.toFixed(2)) : null);
              this.ref.detectChanges();
            }
            this.updateResultManage(this.formArray.at(index) as FormGroup, this.formArray.at(index).get('result').value, 'selfPoint');
            this.updateResultManage(this.formArray.at(index) as FormGroup, this.formArray.at(index).get('resultManage').value, 'managePoint');
          });
        }
        this.ref.detectChanges();
      }
    });
  }


  override initForm() {
    this.form = this.fb.group({
      employeeIndicatorList: this.fb.array([], totalPercentValidator('percent')),
      isEvaluate: [this.isEvaluate ? 'Y' : null],
      isEvaluateManage: [this.isEvaluateManage ? 'Y' : null],
      adjustReason: [null],
      selfTotalPoint: [null],
      managerTotalPoint: [null]
    });
  }

  getValueSelect(data: any, value: any, keyValue = 'value', keyLabel = 'label') {
    return data.find(it => it[keyValue] == value) ? data.find(it => it[keyValue] == value)[keyLabel] : '-';
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

  getTotalSelfPoint(): number {
    const totalPoint = this.formArray.controls.reduce((sum, item) =>
      sum + (parseFloat(item.get('selfPoint')?.value ?? 0) * parseFloat(item.get('percent')?.value ?? 0) / 100 || 0), 0
    );
    return parseFloat(totalPoint.toFixed(2));
  }

  getTotalManagePoint(): number {
    const totalPoint = this.formArray.controls.reduce((sum, item) =>
      sum + (parseFloat(item.get('managePoint')?.value ?? 0) * parseFloat(item.get('percent')?.value ?? 0) / 100 || 0), 0
    );
    return parseFloat(totalPoint.toFixed(2));
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
        data: this.formArray.controls.map(it => it.get('indicatorConversionId').value)
      },
      nzFooter: this.footerTpl
    });
    this.modalRef.afterClose.subscribe((result) => {
        if (result?.data) {
          this.patchValue2(result?.data);
        }
      }
    );
  }

  patchValue2(data) {
    if (data && data.length > 0) {
      data.forEach(it => {
        if (this.formArray.at(0).get('indicatorConversionId').value != null) {
          this.initFormArray();
        }
        this.formArray.at(this.formArray.length - 1).patchValue({
          employeeIndicatorId: it.employeeIndicatorId || null,
          indicatorConversionId: it.indicatorConversionId || null,
          indicatorId: it.indicatorId || null,
          indicatorName: it.indicatorName || null,
          measureUnit: it.unitName || null
        });
        it.conversions.forEach((item: any) => {
          this.formArray.at(this.formArray.length - 1).get(item.resultId).setValue(item.expression);
        });
      });
    }
  }

  initFormArray() {
    const controlsConfig: any = {};
    controlsConfig.employeeIndicatorId = [null];
    controlsConfig.employeeEvaluationId = [this.route.snapshot.queryParams.employeeEvaluationId];
    controlsConfig.indicatorName = [null];
    controlsConfig.indicatorId = [null];
    controlsConfig.measureUnit = [null];
    controlsConfig.oldPercent = [null];
    controlsConfig.isFocusReduction = [null];
    controlsConfig.result = [null, this.isEvaluate ? [Validators.required] : []];
    controlsConfig.selfPoint = [null];
    controlsConfig.resultManage = [null, this.isEvaluateManage ? [Validators.required] : []];
    controlsConfig.managePoint = [null];
    controlsConfig.indicatorConversionId = [null, [Validators.required]];
    controlsConfig.percent = [null, [Validators.required]];
    controlsConfig.target = [null, [Validators.required]];
    controlsConfig.dataSelect = [null];
    controlsConfig.isSelected = [null];
    controlsConfig.isPercent = [null];
    controlsConfig.isOrg = [null];
    controlsConfig.isHead = [null];
    controlsConfig.isWorkPlanningIndex = [null];
    controlsConfig.targetStr = [null];
    this.listConversion.forEach((column: any) => {
      controlsConfig[column.value] = [null];
    });
    const profile = this.fb.group(controlsConfig);
    this.formArray.push(profile);
    profile.get('result')?.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
      if (value != null && value != '') {
        this.updateResultManage(profile, value, 'selfPoint');
      } else {
        profile.get('selfPoint')?.setValue(null);
      }
    });
    profile.get('resultManage')?.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
      if (value != null && value != '') {
        this.updateResultManage(profile, value, 'managePoint');
      } else {
        profile.get('managePoint')?.setValue(null);
      }
    });
  }


  updateResultManage(profile: FormGroup, resultValue: NzSafeAny, name: string) {
    if (resultValue == null) {
      return;
    }

    let resultValueFloat = parseFloat(resultValue);

    const validPoints: number[] = [];
    const isFocusReduction = profile.get('isFocusReduction')?.value;
    if (profile.get('isPercent').value && (this.dataValid.isHead != 'Y' || !profile.get('targetStr')?.value)) {
      resultValueFloat = (profile.get('target').value == 0 && resultValueFloat == 0) ? 0 : profile.get('target').value != 0 ? parseFloat(((resultValueFloat / parseFloat(profile.get('target').value)) * 100).toFixed(2)) : null;
    }
    this.listConversion.forEach((conversion: any) => {
      const value = profile.get(conversion.value)?.value;
      if (value) {
        const conditions = profile.get('isSelected').value ? [value] : value.split(' và ');
        let allValid = true;
        let isNumber = false;
        conditions.forEach((condition: string) => {
          let match;
          if (profile.get('isSelected').value) {
            match = condition.match(/=\s*(.+)/);
          } else {
            match = condition.match(/(>= |<= |> |< |= )\s*(\d+(\.\d+)?)/);
          }
          if (match) {
            if (profile.get('isSelected').value) {
              const text = match[1].trim();
              allValid = resultValue.toLowerCase().trim() == text.toLowerCase();
            } else {
              const operator = match[1];
              const num = parseFloat(match[2]);
              isNumber = true;
              if (num != null && !isNaN(num)) {
                let isValid = false;
                switch (operator) {
                  case '> ':
                    isValid = resultValueFloat > num;
                    break;
                  case '< ':
                    isValid = resultValueFloat < num;
                    break;
                  case '>= ':
                    isValid = resultValueFloat >= num;
                    break;
                  case '<= ':
                    isValid = resultValueFloat <= num;
                    break;
                  case '= ':
                    isValid = resultValueFloat == num;
                    break;
                }

                if (!isValid) {
                  allValid = false;
                }
              } else {
                allValid = false;
              }
            }
          } else {
            if (profile.get('isSelected').value) {
              const text = condition.trim();
              allValid = resultValue.toLowerCase().trim() == text.toLowerCase();
            } else {
              if (!condition.includes('Mức ngưỡng') && !condition.includes('Mức cơ bản') && !condition.includes('Mức đẩy mạnh')) {
                const num = parseFloat(condition);
                allValid = resultValueFloat == num;
                isNumber = true;
              }
            }
          }
        });

        if (allValid && !profile.get('isSelected').value) {
          allValid = isNumber;
        }

        if (allValid) {
          validPoints.push(conversion.value);
        }
      }
    });

    let finalScore = null;
    if (validPoints.length > 0) {
      finalScore = isFocusReduction === 'N' ? Math.max(...validPoints) : Math.min(...validPoints);
    }

    profile.get(name)?.setValue(finalScore);
  }

  get formArray(): FormArray {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
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
    //   this.addNew();
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
    this.body.managerTotalPoint = this.getTotalManagePoint();
    this.body.selfTotalPoint = this.getTotalSelfPoint();
  }

  ngOnDestroy(): void {
    if (this.closeAlertModalSubscription) {
      this.closeAlertModalSubscription.unsubscribe();
    }
  }

}

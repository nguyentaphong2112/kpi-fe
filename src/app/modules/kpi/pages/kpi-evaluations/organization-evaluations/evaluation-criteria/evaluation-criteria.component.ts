import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {
  OrganizationEvaluationsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/organization-evaluations.service';
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
import {
  totalPercentValidator
} from '@app/modules/kpi/pages/kpi-evaluations/employee-evaluations/evaluation-criteria/evaluation-criteria.component';
import {
  IndicatorPopupComponent
} from '@app/modules/kpi/pages/kpi-evaluations/employee-evaluations/indicator-popup/indicator-popup.component';
import { distinctUntilChanged, Subscription } from 'rxjs';
import {
  AlertModalChangeService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/alert-modal-change.service';

@Component({
  selector: 'app-evaluation-criteria',
  templateUrl: './evaluation-criteria.component.html',
  styleUrls: ['./evaluation-criteria.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluationCriteriaComponent extends BaseFormComponent<NzSafeAny> implements OnInit, OnDestroy {
  readonly FORM_ARRAY_NAME = 'organizationIndicatorList';
  readonly FORM_ARRAY_TARGET = 'targetList';
  actionSchema: ActionSchema;
  // listDataSelect = [];
  listConversion = [];
  listTarget = [];
  isDetail = false;
  isEvaluateDetail = false;
  isEvaluate = false;
  isVisible = false;
  valueInput = '';
  isSubmittedModal = false;
  adjustReason = '';
  organizationId = null;
  isEvaluateManage = false;
  orgId = null;
  private closeAlertModalSubscription: Subscription;
  result = null;

  @ViewChild('footerTmpl', { static: true }) footerTpl!: TemplateRef<any>;
  @Input() formParent: FormGroup;
  @Input() isSubmittedParent: boolean;
  @Output() isSubmittedParentChange = new EventEmitter<boolean>();
  @Input() dataValid: any;


  constructor(
    injector: Injector,
    private readonly service: OrganizationEvaluationsService,
    private categoryService: CategoriesService,
    private alertModalChangeService: AlertModalChangeService
  ) {
    super(injector);
    this.mode = Mode.EDIT;
    this.isDetail = this.route.snapshot.queryParams.isDetail;
    this.isEvaluateDetail = this.route.snapshot.queryParams.isEvaluateDetail;
    this.isEvaluate = this.route.snapshot.queryParams.isEvaluate;
    this.isEvaluateManage = this.route.snapshot.queryParams.isEvaluateManage;
    this.orgId = this.route.snapshot.queryParams.organizationId;
    this.isPage = true;
    this.initAction();
    this.initDataSelect();
    this.findOneById = (id) => this.service.findOneById(id, UrlConstant.ORGANIZATION_EVALUATION.INDICATOR);
    this.createApi = (body: OrganizationEvaluationsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA, UrlConstant.ORGANIZATION_EVALUATION.INDICATOR);
    this.updateApi = (body: OrganizationEvaluationsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA, UrlConstant.ORGANIZATION_EVALUATION.INDICATOR);
    this.key = 'organizationEvaluationId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.onListener();
  }


  onListener() {
    this.closeAlertModalSubscription = this.alertModalChangeService.saveValue$.subscribe((res: any) => {
      this.result = res;
      this.formArray.controls.forEach(it => {
        if (it.get('isWorkPlanningIndex').value == 'Y') {
          it.get(this.isEvaluateManage ? 'resultManage' : 'result').setValue(!isNaN(res) ? Number(this.result.toFixed(2)) : null);
          this.ref.detectChanges();
        }
      });
    });
  }


  patchValue() {
    this.service.findOneById(this.route.snapshot.queryParams.organizationEvaluationId, UrlConstant.ORGANIZATION_EVALUATION.INDICATOR).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.adjustReason = res.data.adjustReason;
        if (res.data.listData && res.data.listData.length > 0) {
          res.data.listData.forEach((it, index) => {
            this.initFormArray((it.isChildren && this.orgId == 1));
            it.conversions?.forEach((item: any) => {
              this.formArray.at(index).get(item.resultId).setValue(item.expression);
            });
            // if (this.listTarget.length > 0) {
            // while (typeof it.target === 'string') {
            //   it.target = JSON.parse(it.target);
            // }
            // const target = JSON.parse(it.target);
            this.formArray.at(index).patchValue({
              dataSelect: it?.listValues?.split(';').map(it => ({
                label: it,
                value: it
              })) || null,
              isSelected: it.ratingType == 'SELECT' && it.conversionType != 'DON_VI',
              organizationIndicatorId: it.organizationIndicatorId || null,
              indicatorConversionId: it.indicatorConversionId || null,
              indicatorId: it.indicatorId || null,
              key: it.key || null,
              level: it.level || null,
              isChildren: it.isChildren || null,
              indicatorName: it.indicatorName || null,
              measureUnit: it.unitName || null,
              statusLevel1: it.statusLevel1 || null,
              percent: it.percent,
              result: it.result,
              resultManage: it.resultManage || (this.isEvaluateManage ? it.result : null),
              isFocusReduction: it.isFocusReduction || null,
              oldPercent: it.oldPercent || null,
              conversionType: it.conversionType || null,
              isWorkPlanningIndex: it.isWorkPlanningIndex || null,
              target: it.target || null
            });
            if (it.isWorkPlanningIndex == 'Y') {
              this.formArray.at(index).get(this.isEvaluateManage ? 'resultManage' : 'result').setValue(!isNaN(this.result) ? Number(this.result.toFixed(2)) : null);
              this.ref.detectChanges();
            }
            // this.listTarget.forEach((item: any) => {
            //   const targetArray = this.formArray.at(index).get('target') as FormArray;
            //   targetArray.at(0).get(item.value).setValue(target[0][item.value] ?? null);
            // });
            this.updateResultManage(this.formArray.at(index) as FormGroup, this.formArray.at(index).get('result').value, 'selfPoint');
            this.updateResultManage(this.formArray.at(index) as FormGroup, this.formArray.at(index).get('resultManage').value, 'managePoint');
            // }
          });
        }
        this.ref.detectChanges();
      }
    });
  }


  getValueSelect(data: any, value: any, keyValue = 'value', keyLabel = 'label') {
    return data.find(it => it[keyValue] == value) ? data.find(it => it[keyValue] == value)[keyLabel] : '-';
  }

  // addData($event) {
  //   if ($event) {
  //     if (this.formArray.at(this.formArray.length - 1).get('indicatorConversionId').value == null) {
  //       this.formArray.at(this.formArray.length - 1).get('indicatorConversionId').setValue($event);
  //     } else {
  //       this.addNew();
  //       if (!this.isSubmitted) {
  //         this.formArray.at(this.formArray.length - 1).get('indicatorConversionId').setValue($event);
  //       }
  //     }
  //     setTimeout(() => {
  //       this.dataAdd = null;
  //     });
  //   }
  // }

  openModal() {
    this.isSubmitted = true;
    this.isSubmittedParentChange.emit(true);
    if (this.form.valid && this.formParent.valid) {
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

  openIndicatorPopup() {
    // this.modalRef = this.modal.create({
    //   nzWidth: window.innerWidth / 1.2 > 1500 ? 1500 : window.innerWidth / 1.2,
    //   nzTitle: this.translate.instant('kpi.employeeEvaluations.label.selectedIndicator'),
    //   nzContent: IndicatorPopupComponent,
    //   nzComponentParams: {
    //     mode: this.modeConst.ADD,
    //     data: this.formArray.controls.map(it => it.get('indicatorConversionId').value),
    //     org: true,
    //     orgId: this.orgId
    //   },
    //   nzFooter: this.footerTpl
    // });
    // this.modalRef.afterClose.subscribe((result) => {
    //     if (result?.data) {
    //       this.patchValue2(result?.data);
    //     }
    //   }
    // );
  }

  override initForm() {
    this.form = this.fb.group({
      organizationIndicatorList: this.fb.array([], totalPercentValidator('percent', this.orgId)),
      isEvaluate: [this.isEvaluate ? 'Y' : null],
      isEvaluateManage: [this.isEvaluateManage ? 'Y' : null],
      adjustReason: [null],
      selfTotalPoint: [null],
      managerTotalPoint: [null]
    });
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

  initDataSelect() {
    // this.indicatorService.getList(null, UrlConstant.INDICATOR.GET_LIST + '/' + this.route.snapshot.queryParams.organizationId).subscribe(res => {
    //   if (res.code === HTTP_STATUS_CODE.SUCCESS) {
    //     this.listDataSelect = res.data;
    //   }
    // });
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_DKY_MUC_TIEU_DON_VI)).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listTarget = res.data;
      }
    });
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_THANG_DO)).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listConversion = res.data;
        this.patchValue();
        this.ref.detectChanges();
      }
    });
  }

  initFormArray(isNotRequired = false) {
    const controlsConfig: any = {};
    controlsConfig.organizationIndicatorId = [null];
    controlsConfig.organizationEvaluationId = [this.route.snapshot.queryParams.organizationEvaluationId];
    controlsConfig.indicatorId = [null];
    controlsConfig.indicatorName = [null];
    controlsConfig.measureUnit = [null];
    controlsConfig.oldPercent = [null];
    controlsConfig.isFocusReduction = [null];
    controlsConfig.result = [null, this.isEvaluate && !isNotRequired ? [Validators.required] : []];
    controlsConfig.selfPoint = [null];
    controlsConfig.resultManage = [null, this.isEvaluateManage && !isNotRequired ? [Validators.required] : []];
    controlsConfig.managePoint = [null];
    controlsConfig.statusLevel1 = [null];
    controlsConfig.key = [null];
    controlsConfig.level = [null];
    controlsConfig.indicatorConversionId = [null, !isNotRequired ? [Validators.required] : null];
    controlsConfig.percent = [null, !isNotRequired ? [Validators.required] : null];
    controlsConfig.conversionType = [null];
    controlsConfig.isChildren = [null];
    controlsConfig.dataSelect = [null];
    controlsConfig.isSelected = [null];
    controlsConfig.isWorkPlanningIndex = [null];
    controlsConfig.target = [null, [Validators.required]];
    // if (this.listTarget.length > 0) {
    //   // const controlsConfigChild: any = {};
    //   this.listTarget.forEach((column: any) => {
    //     controlsConfig[column.code] = [null];
    //   });
    //   // const target = this.fb.group(controlsConfigChild);
    //   // controlsConfig.target.push(target);
    // }
    this.listConversion.forEach((column: any) => {
      controlsConfig[+column.value] = [null];
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

    const resultValueFloat = parseFloat(resultValue);

    const validPoints: number[] = [];
    const isFocusReduction = profile.get('isFocusReduction')?.value;

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


  isOperatorCompatible(operator: string, targetOperator: string): boolean {
    const op = operator.trim();
    const targetOp = targetOperator.trim();

    const compatibilityMap = {
      '>': ['>', '>='],
      '>=': ['>=', '>'],
      '<': ['<', '<='],
      '<=': ['<=', '<'],
      '=': ['=', '<=', '>=']
    };

    return compatibilityMap[op]?.includes(targetOp) ?? false;
  }

  isOperatorIncompatibleAutoRight(op1: string, op2: string): boolean {
    const incompatiblePairs = [
      ['>', '<'], ['>', '<='],
      ['>=', '<'], ['>=', '<='],
      ['<', '>'], ['<', '>='],
      ['<=', '>'], ['<=', '>=']
    ];

    const a = op1.trim();
    const b = op2.trim();

    return incompatiblePairs.some(([x, y]) => x === a && y === b);
  }


  evaluateTarget(result: number, operator: string, value: number): boolean {
    switch (operator) {
      case '>':
        return result > value;
      case '<':
        return result < value;
      case '>=':
        return result >= value;
      case '<=':
        return result <= value;
      case '=':
        return result == value;
      default:
        return false;
    }
  }


  get formArray(): FormArray {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  get targetArray(): FormArray {
    return this.form.controls[this.FORM_ARRAY_TARGET] as FormArray;
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
    this.isSubmittedParentChange.emit(true);
    this.invalidFormViewChild = this.formParent.invalid;
    this.body.empManagerId = this.formParent.get('empManagerId').value;
    this.body['id'] = this.route.snapshot.queryParams.organizationEvaluationId;
    this.body.managerTotalPoint = this.getTotalManagePoint();
    this.body.selfTotalPoint = this.getTotalSelfPoint();
    // if (this.listTarget.length > 0) {
    //   this.body.organizationIndicatorList?.forEach((column: any) => {
    //     column.target = JSON.stringify(column.target);
    //   });
    // }
  }

  ngOnDestroy(): void {
    if (this.closeAlertModalSubscription) {
      this.closeAlertModalSubscription.unsubscribe();
    }
  }
}

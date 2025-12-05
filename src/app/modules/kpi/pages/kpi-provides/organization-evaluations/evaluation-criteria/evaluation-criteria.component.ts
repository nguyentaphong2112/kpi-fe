import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
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
import { IndicatorsService } from '@app/modules/kpi/data-access/services/kpi-managers/indicators.service';
import {
  totalPercentValidator
} from '@app/modules/kpi/pages/kpi-evaluations/employee-evaluations/evaluation-criteria/evaluation-criteria.component';
import {
  IndicatorPopupComponent
} from '@app/modules/kpi/pages/kpi-provides/employee-evaluations/indicator-popup/indicator-popup.component';
import {
  AssignmentModalComponent
} from '@app/modules/kpi/pages/kpi-provides/organization-evaluations/assignment-modal/assignment-modal.component';
import {
  ViewIndicatorComponent
} from '@app/modules/kpi/pages/kpi-provides/employee-evaluations/view-indicator/view-indicator.component';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-evaluation-criteria',
  templateUrl: './evaluation-criteria.component.html',
  styleUrls: ['./evaluation-criteria.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluationCriteriaComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  readonly FORM_ARRAY_NAME = 'organizationIndicatorList';
  readonly FORM_ARRAY_TARGET = 'targetList';
  actionSchema: ActionSchema;
  // listDataSelect = [];
  listConversion = [];
  listType = [];
  listTarget = [];
  isDetail = false;
  isAdjust = false;
  isEvaluate = false;
  isVisible = false;
  valueInput = '';
  isSubmittedModal = false;
  adjustReason = '';
  orgId = null;
  mapChildrenByParent = new Map<string, any[]>();
  private renderedParents = new Set<string>();

  @ViewChild('footerTmpl', { static: true }) footerTpl!: TemplateRef<any>;
  @ViewChild('footerCancelTmpl', { static: true }) footerCancelTpl!: TemplateRef<any>;
  @Input() dataValid: any;
  @Input() formParent: FormGroup;
  @Input() isSubmittedParent: boolean;
  @Output() isSubmittedParentChange = new EventEmitter<boolean>();

  constructor(
    injector: Injector,
    private readonly service: OrganizationEvaluationsService,
    private categoryService: CategoriesService,
    private cdr: ChangeDetectorRef,
    private readonly indicatorService: IndicatorsService
  ) {
    super(injector);
    this.mode = Mode.EDIT;
    this.isDetail = this.route.snapshot.queryParams.isDetail;
    this.isAdjust = this.route.snapshot.queryParams.isAdjust;
    this.isEvaluate = this.route.snapshot.queryParams.isEvaluate;
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
    if (this.dataValid.adjust) {
      this.isDetail = true;
    }
  }

  // renderData(typeValue: string, typeName: string, listData: any[]) {
  //   const children = this.mapChildrenByParent.get(typeValue);
  //   let shouldRenderParent = false;
  //   const hasChildData = this.checkAnyChildData(typeValue, listData);
  //
  //   const currentData = listData.filter(it => it.type === typeValue);
  //
  //   if (currentData.length > 0 || hasChildData) {
  //     if (!this.renderedParents.has(typeValue)) {
  //       this.initListData([{ indicatorName: typeName }]);
  //       if (currentData.length > 0) {
  //         this.initListData(currentData);
  //       }
  //       this.renderedParents.add(typeValue);
  //     }
  //     shouldRenderParent = true;
  //   }
  //
  //   if (children && children.length > 0) {
  //     for (const child of children) {
  //       this.renderData(child.value, child.name, listData);
  //     }
  //   }
  //
  //   if (!shouldRenderParent && currentData.length > 0) {
  //     this.initListData([{ indicatorName: typeName }]);
  //     this.initListData(currentData);
  //   }
  // }
  //
  // checkAnyChildData(parentValue: string, listData: any[]): boolean {
  //   const children = this.mapChildrenByParent.get(parentValue);
  //   if (!children || children.length === 0) return false;
  //
  //   for (const child of children) {
  //     if (listData.some(it => it.type === child.value)) {
  //       return true;
  //     }
  //     if (this.checkAnyChildData(child.value, listData)) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  initListData(data: NzSafeAny) {
    data.forEach((it) => {
      // let listCheckRequired = this.getListRequired(it);
      this.initFormArray((it.isChildren && this.orgId == 1));
      const index = this.formArray.length - 1;
      // while (typeof it.target === 'string') {
      //   it.target = JSON.parse(it.target);
      // }
      this.formArray.at(index).patchValue({
        organizationIndicatorId: it.organizationIndicatorId || null,
        indicatorConversionId: it.indicatorConversionId || null,
        indicatorId: it.indicatorId || null,
        key: it.key || null,
        level: it.level || null,
        isChildren: it.isChildren || null,
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
        result: it.result || null,
        leaderIds: it.leaderIds || null,
        collaboratorIds: it.collaboratorIds || null,
        assignmentNote: it.assignmentNote || null,
        leaderType: it.leaderType || null,
        collaboratorType: it.collaboratorType || null,
        leaderName: it.leaderName || null,
        collaboratorName: it.collaboratorName || null,
        statusLevel1: it.statusLevel1 || null,
        oldPercent: it.oldPercent || null,
        dataSelect: it?.listValues?.split(';').map(it => ({
          label: it,
          value: it
        })) || null,
        target: it.target,
        isSelected: it.ratingType == 'SELECT' && it.conversionType != 'DON_VI'
      });
      it.conversions?.forEach((item: any) => {
        this.formArray.at(index).get(item.resultId).setValue(item.expression);
      });
    });
    this.ref.detectChanges();
  }


  patchValue() {
    this.service.findOneById(this.route.snapshot.queryParams.organizationEvaluationId, UrlConstant.ORGANIZATION_EVALUATION.INDICATOR).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.adjustReason = res.data.adjustReason;
        if (res.data.listData && res.data.listData.length > 0) {

          // for (let i = 0; i < this.listType.length; i++) {
          //   const typeData = this.listType[i];
          //   if (!typeData.attributes?.PARENT_ID) {
          //     this.renderData(typeData.value, typeData.name, res.data.listData);
          //   }
          // }
          this.initListData(res.data.listData);
        }
      }
    });
  }

  getTotalPercent(): number {
    let totalPoint = 0;
    if (this.orgId == 1) {
      totalPoint = this.formArray.controls.reduce((sum, item) => {
          if (item.get('level')?.value == 1) {
            return sum + (parseFloat(item.get('percent')?.value ? item.get('percent')?.value : 0));
          }
          return sum;
        }, 0
      );
    } else {
      totalPoint = this.formArray.controls.reduce((sum, item) =>
        sum + (parseFloat(item.get('percent')?.value ? item.get('percent')?.value : 0)), 0
      );
    }
    return parseFloat(totalPoint?.toFixed(2));
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
    this.modalRef = this.modal.create({
      nzWidth: window.innerWidth / 1.2 > 1500 ? 1500 : window.innerWidth / 1.2,
      nzTitle: this.translate.instant('kpi.employeeEvaluations.label.selectedIndicator'),
      nzContent: IndicatorPopupComponent,
      nzComponentParams: {
        mode: this.modeConst.ADD,
        data: this.formArray.controls.map(it => it.get('indicatorConversionId').value),
        org: true,
        orgId: this.orgId
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
          this.ref.detectChanges();
        }
      }
    );
  }


  openAssignmentPopup = (data: FormGroup) => {
    const index = this.formArray.controls.findIndex((it: NzSafeAny) => it.value.indicatorId == data.controls['indicatorId'].value);
    this.modalRef = this.modal.create({
      nzWidth: window.innerWidth / 1.2 > 1100 ? 1100 : window.innerWidth / 1.5,
      nzTitle: this.translate.instant('kpi.button.assignment'),
      nzContent: AssignmentModalComponent,
      nzComponentParams: {
        mode: this.modeConst.ADD,
        data: this.formArray.at(index).value
      },
      nzFooter: this.footerTpl
    });
    this.modalRef.afterClose.subscribe((result) => {
        if (result?.data) {
          this.patchValueAssignment(result.data, index);
        }
      }
    );
  };

  patchValueAssignment(data: NzSafeAny, index: number) {
    this.formArray.at(index).patchValue({
      leaderIds: data.leaderIds || null,
      collaboratorIds: data.collaboratorIds || null,
      leaderType: data.leaderType || null,
      collaboratorType: data.collaboratorType || null,
      assignmentNote: data.assignmentNote || null,
      leaderName: data.leaderName || null,
      collaboratorName: data.collaboratorName || null
    });
    this.ref.detectChanges();
  }

  patchValue2(data) {
    if (data && data.length > 0) {
      data.forEach(it => {
        // let listCheckRequired = this.getListRequired(it);
        this.initFormArray();
        this.formArray.at(this.formArray.length - 1).patchValue({
          organizationIndicatorId: it.organizationIndicatorId || null,
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
          level: 1,
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
      this.ref.detectChanges();
    }
  }

  // getListRequired(it) {
  //   const result = {
  //     1: false,
  //     2: false,
  //     3: false
  //   };
  //
  //   if (it.conversionType === 'DON_VI') {
  //     it.conversions.forEach((item: any) => {
  //       let conditions = item.expression.split(' và ');
  //       conditions.forEach((condition: string) => {
  //         let match = condition.match(/(>=|<=|>|<|=)\s*(.+)/);
  //         let value = match ? match[2].trim() : condition.trim();
  //
  //         if (value == 'Mức ngưỡng') {
  //           result[1] = true;
  //         } else if (value == 'Mức cơ bản') {
  //           result[2] = true;
  //         } else if (value == 'Mức đẩy mạnh') {
  //           result[3] = true;
  //         }
  //       });
  //     });
  //   }
  //
  //   return result;
  // }

  override initForm() {
    this.form = this.fb.group({
      organizationIndicatorList: this.fb.array([], totalPercentValidator('percent', this.orgId)),
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
          label: 'kpi.button.assignment',
          icon: 'aim',
          function: this.openAssignmentPopup
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          function: this.onDelete
        })
      ]
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

  initDataSelect() {
    // this.indicatorService.getList(null, UrlConstant.INDICATOR.GET_LIST + '/' + this.route.snapshot.queryParams.organizationId).subscribe(res => {
    //   if (res.code === HTTP_STATUS_CODE.SUCCESS) {
    //     this.listDataSelect = res.data;
    //   }
    // });
    // this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_PHAN_LOAI) + '?isGetAttribute=true').subscribe(res => {
    //   if (res.code === HTTP_STATUS_CODE.SUCCESS) {
    //     this.listType = res.data;
    //     this.listType.sort((a, b) => {
    //       const valueA = a.value || '';
    //       const valueB = b.value || '';
    //       return valueB.localeCompare(valueA);
    //     });
    //     this.listType.forEach(typeData => {
    //       const parentId = typeData.attributes?.PARENT_ID;
    //       if (parentId) {
    //         if (!this.mapChildrenByParent.has(parentId)) {
    //           this.mapChildrenByParent.set(parentId, []);
    //         }
    //         this.mapChildrenByParent.get(parentId).push(typeData);
    //       }
    //     });
    //   }
    // });
    // this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_DKY_MUC_TIEU_DON_VI)).subscribe(res => {
    //   if (res.code === HTTP_STATUS_CODE.SUCCESS) {
    //     this.listTarget = res.data;
    //   }
    // });
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_THANG_DO)).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listConversion = res.data;
        this.patchValue();
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
    controlsConfig.typeName = [null];
    controlsConfig.periodTypeName = [null];
    controlsConfig.relatedNames = [null];
    controlsConfig.scopeNames = [null];
    controlsConfig.significance = [null];
    controlsConfig.measurement = [null];
    controlsConfig.note = [null];
    controlsConfig.systemInfo = [null];
    controlsConfig.leaderIds = [null];
    controlsConfig.key = [null];
    controlsConfig.level = [null];
    controlsConfig.isChildren = [null];
    controlsConfig.collaboratorIds = [null];
    controlsConfig.assignmentNote = [null];
    controlsConfig.leaderType = [null];
    controlsConfig.collaboratorType = [null];
    controlsConfig.leaderName = [null];
    controlsConfig.collaboratorName = [null];
    controlsConfig.statusLevel1 = [null];
    controlsConfig.target = [null, [Validators.required]];
    controlsConfig.result = [null, this.isEvaluate && !isNotRequired ? [Validators.required] : []];
    controlsConfig.indicatorConversionId = [null, !isNotRequired ? [Validators.required] : null];
    controlsConfig.percent = [null, !isNotRequired ? [Validators.required] : null];
    controlsConfig.dataSelect = [null];
    controlsConfig.isSelected = [null];
    // if (this.listTarget.length > 0) {
    //   const controlsConfigChild: any = {};
    //   this.listTarget.forEach((column: any) => {
    //     // controlsConfigChild[+column.value] = [null, listCheckRequired[+column.value] ? [Validators.required] : null];
    //     controlsConfig[column.code] = [null, column.code == 'M3' ? [Validators.required] : null];
    //   });
    // }
    this.listConversion.forEach((column: any) => {
      controlsConfig[+column.value] = [null];
    });
    const profile = this.fb.group(controlsConfig);
    // if (!isNotRequired) {
    //   this.listTarget.forEach((column: any) => {
    //     profile.get(column.code)?.valueChanges
    //       .pipe(distinctUntilChanged())
    //       .subscribe(() => this.changeDuplicateTarget(profile));
    //   });
    // }
    this.formArray.push(profile);
    this.cdr.detectChanges();
  }

  changeValidTarget(target: FormGroup) {
    const hasValue = this.listTarget.some(column => !!target.get(column.code)?.value);

    this.listTarget.forEach(column => {
      const control = target.get(column.code);
      if (!control) return;

      control.setValidators(hasValue ? null : [Validators.required]);
      if (hasValue) {
        control.setErrors(null);
      }
      control.updateValueAndValidity({ onlySelf: true });
    });
  }

  changeDuplicateTarget(target: FormGroup) {
    const values = this.listTarget.map(column => ({
      code: column.code,
      control: target.get(column.code),
      value: target.get(column.code)?.value
    }));

    values.forEach(({ control }) => {
      if (control) {
        const errors = { ...control.errors };
        if (errors && errors['duplicate']) {
          delete errors['duplicate'];
          control.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    });

    values.forEach((item, i) => {
      if (!item.control || !item.value) return;
      const isDuplicate = values.some(
        (other, j) => j !== i && other.value && other.value === item.value
      );
      if (isDuplicate) {
        const errors = { ...item.control.errors };
        errors['duplicate'] = true;
        item.control.setErrors(errors);
      }
    });
  }

  get formArray(): FormArray {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  get targetArray(): FormArray {
    return this.form.controls[this.FORM_ARRAY_TARGET] as FormArray;
  }

  strReplaceSpace(str: any) {
    return str.replace(/\s/g, ' ');
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
    this.ref.detectChanges();
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
    this.isSubmittedParentChange.emit(true);
    this.invalidFormViewChild = this.formParent.invalid;
    this.body['id'] = this.route.snapshot.queryParams.organizationEvaluationId;
    this.body.empManagerId = this.formParent.get('empManagerId').value;
    // if (this.listTarget.length > 0) {
    //   this.body.organizationIndicatorList.forEach((column: any) => {
    //     column.target = JSON.stringify(column.target);
    //   });
    // }
  }

}

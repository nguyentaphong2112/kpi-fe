import { ChangeDetectorRef, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { Scopes } from '@core/utils/common-constants';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {
  OrganizationEvaluationsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/organization-evaluations.service';
import { CategoriesService } from '@app/modules/kpi/data-access/other-services/categories.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { REQUEST_TYPE } from '@shared/constant/common';
import { BaseListComponent } from '@core/components/base-list.component';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import {
  ViewIndicatorComponent
} from '@app/modules/kpi/pages/kpi-provides/employee-evaluations/view-indicator/view-indicator.component';
import {
  EvaluationResultsService
} from '@app/modules/hrm/data-access/services/staff-research/evaluation-results.service';

@Component({
  selector: 'app-opl-index',
  templateUrl: './opl-index.component.html',
  styleUrls: ['./opl-index.component.scss']
})
export class OplIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {

  functionCode = Constant.FUNCTION_CODE.ORGANIZATION_PROVIDE_LEVEL1;
  microService = MICRO_SERVICE;
  scope = Scopes.VIEW;
  urlLoadPeriod = UrlConstant.GET_EVALUATION_PERIODS;
  organizationEvaluationId = null;
  isShowAdvSearch = false;
  statusCodeList: NzSafeAny[] = [];
  isVisible = false;
  valueInput = '';
  statusCodes = Constant.KPI_ORGANIZATION_EVALUATION_STATUS;
  readonly FORM_ARRAY_NAME = 'organizationIndicatorList';
  listConversion = [];
  listTarget = [];
  evaluationPeriodList = [];

  @ViewChild('statusTmpl', { static: true }) statusTmpl!: TemplateRef<NzSafeAny>;
  @ViewChild('footerCancelTmpl', { static: true }) footerCancelTpl!: TemplateRef<any>;
  formTable!: FormGroup;

  constructor(
    injector: Injector,
    private readonly service: OrganizationEvaluationsService,
    private cdr: ChangeDetectorRef,
    private readonly categoryService: CategoriesService,
    private evaluationResultsService: EvaluationResultsService
  ) {
    super(injector);
    this.nameLocalSearch = 'search-provides-org-evaluation';
    this.nameLocalForm = 'provides-oes-form';
    this.initFormSearch();
    this.getDataSelect();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination, '/level1');
    this.key = 'organizationEvaluationId';
  }

  ngOnInit() {
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.getPeriodData();
    this.initAction();
  }


  resetForm() {
    while (this.formArray.length > 0) {
      this.formArray.removeAt(0);
    }
  }

  get formArray(): FormArray {
    return this.formTable.controls[this.FORM_ARRAY_NAME] as FormArray;
  }


  getPeriodData() {
    this.evaluationResultsService.getList(null, '/evaluation_periods?evaluationType=2').subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.form.controls['evaluationPeriodId'].setValue(res.data ? res.data[0]?.evaluationPeriodId : null);
        this.evaluationPeriodList = res.data;
      }
    });
  }

  getDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.STATUS_KPI_LEVEL1))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.statusCodeList = res.data.map((item: NzSafeAny) => {
            if ([Constant.STATUS.DU_THAO, Constant.STATUS.YEU_CAU_NHAP_LAI].includes(item.code)) {
              item.color = '#141ED2';
              item.bgColor = '#E9EAFF';
            } else if ([Constant.STATUS.CHO_XAC_NHAN].includes(item.code)) {
              item.color = '#F99600';
              item.bgColor = '#FFF2DA';
            } else if ([Constant.STATUS.TU_CHOI_PHE_DUYET, Constant.STATUS.TU_CHOI_XET_DUYET].includes(item.code)) {
              item.color = '#FA0B0B';
              item.bgColor = '#FDE7EA';
            } else {
              item.color = '#06A561';
              item.bgColor = '#DAF9EC';
            }
            return item;
          });
        }
      });
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_DKY_MUC_TIEU_DON_VI)).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listTarget = res.data;
      }
    });
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_THANG_DO)).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listConversion = res.data;
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

  override search() {
    const params = this.form.value;
    this.params = {
      ...params,
      organizationId: 1
    };
    this.service.getData(this.params, UrlConstant.ORGANIZATION_EVALUATION.INDICATOR_LEVEL1).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.initListData(res.data.listData);
      }
    });
  }

  initListData(data: NzSafeAny) {
    this.resetForm();
    data.forEach((it) => {
      // let listCheckRequired = this.getListRequired(it);
      this.initFormArray(it.isChildren);
      const index = this.formArray.length - 1;
      if (this.listTarget.length > 0) {
        // while (typeof it.target === 'string') {
        //   it.target = JSON.parse(it.target);
        // }
        const target = it.target ? JSON.parse(it.target) : null;
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
          leaderIds: it.leaderIds || null,
          collaboratorIds: it.collaboratorIds || null,
          assignmentNote: it.assignmentNote || null,
          leaderType: it.leaderType || null,
          collaboratorType: it.collaboratorType || null,
          leaderName: it.leaderName || null,
          collaboratorName: it.collaboratorName || null,
          statusLevel1: it.statusLevel1 || null,
          statusNameLevel1: it.statusNameLevel1 || null,
          oldPercent: it.oldPercent || null,
          dataSelect: it?.listValues?.split(';').map(it => ({
            label: it,
            value: it
          })) || null,
          isSelected: it.ratingType == 'SELECT' && it.conversionType != 'DON_VI'
        });
        if (target != null) {
          this.listTarget.forEach((item: any) => {
            this.formArray.at(index).get(item.code).setValue(target[item.code.toLowerCase()] ?? null);
          });
        }
      }
      it.conversions?.forEach((item: any) => {
        this.formArray.at(index).get(item.resultId).setValue(item.expression);
      });
    });
  }

  initFormArray(isNotRequired = false) {
    const controlsConfig: any = {};
    controlsConfig.organizationIndicatorId = [null];
    controlsConfig.organizationEvaluationId = [this.organizationEvaluationId];
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
    controlsConfig.statusLevel1 = [null];
    controlsConfig.statusNameLevel1 = [null];
    controlsConfig.collaboratorName = [null];
    controlsConfig.indicatorConversionId = [null, !isNotRequired ? [Validators.required] : null];
    controlsConfig.percent = [null];
    controlsConfig.dataSelect = [null];
    controlsConfig.isSelected = [null];
    if (this.listTarget.length > 0) {
      const controlsConfigChild: any = {};
      this.listTarget.forEach((column: any) => {
        // controlsConfigChild[+column.value] = [null, listCheckRequired[+column.value] ? [Validators.required] : null];
        controlsConfig[column.code] = [null, !isNotRequired ? [Validators.required] : null];
      });
    }
    this.listConversion.forEach((column: any) => {
      controlsConfig[+column.value] = [null];
    });
    const profile = this.fb.group(controlsConfig);
    if (!isNotRequired) {
      this.listTarget.forEach((column: any) => {
        profile.get(column.code)?.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(() => this.changeValidTarget(profile));
      });
    }
    this.formArray.push(profile);
    this.cdr.detectChanges();
  }


  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null],
      evaluationPeriodId: [null]
    });
    this.formTable = this.fb.group({
      organizationIndicatorList: this.fb.array([])
    });
    this.form.controls['evaluationPeriodId'].valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
      if (value) {
        setTimeout(() => {
          this.search();
        });
      }
    });
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

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.sendConfirm',
          icon: 'send',
          isShowFn: (evt: any) => (evt.controls.statusLevel1.value === Constant.STATUS.DU_THAO || evt.controls.statusLevel1.value === Constant.STATUS.YEU_CAU_NHAP_LAI) && this.objFunction?.edit,
          function: (evt: any) => {
            this.sendApprove(evt);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.confirm',
          icon: 'check',
          isShowFn: (evt: any) => evt.controls.statusLevel1.value === Constant.STATUS.CHO_XAC_NHAN && this.objFunction?.approve,
          function: (evt: any) => {
            this.confirm([evt.controls.organizationIndicatorId.value], 'Y');
          }
        }),
        new ChildActionSchema({
          label: 'common.button.adjustRequest2',
          icon: 'send',
          isShowFn: (evt: any) => evt.controls.statusLevel1.value === Constant.STATUS.CHO_XAC_NHAN && this.objFunction?.approve,
          function: (evt: any) => {
            this.confirm([evt.controls.organizationIndicatorId.value], 'N');
          }
        })
      ]
    });
  }


  openModal(id: number) {
    this.isVisible = true;
    this.isSubmitted = false;
    this.organizationEvaluationId = id;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.valueInput = '';
  }

  handleOk(): void {
    this.isSubmitted = true;
    if (this.valueInput.trim()) {
      this.updateStatus(this.organizationEvaluationId, Constant.STATUS.YC_NHAP_LAI, this.valueInput);
    }
  }

  updateStatus(id: NzSafeAny, status: string, reasonRequest = '') {
    this.service.update({
      id: id,
      status: status,
      reasonRequest: reasonRequest
    }, REQUEST_TYPE.DEFAULT, UrlConstant.EMPLOYEE_EVALUATION.STATUS_APPROVED).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.isVisible = false;
        this.search();
      }
    });
  }

  override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 50
      },
      {
        title: 'kpi.kpiEvaluations.organizations.table.org',
        field: 'organizationName',
        thClassList: ['text-center'],
        width: 350
      },
      {
        title: 'kpi.kpiEvaluations.organizations.table.status',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.statusTmpl,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 200
      },
      {
        title: 'kpi.kpiEvaluations.organizations.table.period',
        field: 'evaluationPeriodName',
        width: 300,
        thClassList: ['text-center']
      },
      {
        title: 'kpi.employeeEvaluations.label.reasonRequest',
        field: 'reasonRequest',
        thClassList: ['text-center'],
        width: 200
      },
      {
        title: 'kpi.kpiEvaluations.organizations.table.createdTime',
        field: 'createdTime',
        show: false,
        width: 150
      },
      {
        title: 'kpi.kpiEvaluations.organizations.table.createdBy',
        field: 'createdBy',
        show: false,
        width: 150
      },
      {
        title: 'kpi.kpiEvaluations.organizations.table.approvedTime',
        field: 'approvedTime',
        show: false,
        width: 150
      },
      {
        title: 'kpi.kpiEvaluations.organizations.table.approvedBy',
        field: 'approvedBy',
        show: false,
        width: 150
      },
      {
        title: 'kpi.kpiEvaluations.organizations.table.modifiedTime',
        field: 'modifiedTime',
        show: false,
        width: 150
      },
      {
        title: 'kpi.kpiEvaluations.organizations.table.modifiedBy',
        field: 'modifiedBy',
        show: false,
        width: 150
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
        width: 80,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
  }

  strReplaceSpace(str: any) {
    return str.replace(/\s/g, ' ');
  }

  updateApprove(type: string, id: NzSafeAny) {
    this.service.createOrImport({ ids: [id] }, REQUEST_TYPE.DEFAULT, UrlConstant.ORGANIZATION_EVALUATION.APPROVE + type).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
    });
  }

  updateReview(type: string, id: NzSafeAny) {
    this.service.createOrImport({ ids: [id] }, REQUEST_TYPE.DEFAULT, UrlConstant.ORGANIZATION_EVALUATION.REVIEW + type).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
    });
  }


  sendApprove(data: any) {
    this.isSubmitted = true;
    if (this.form.valid) {
      let listData = [{
        organizationIndicatorId: data.controls.organizationIndicatorId.value,
        target: {}
      }];
      this.listTarget.forEach((item: any) => {
        listData[0].target[item.code] = data.controls[item.code].value;
      });
      this.service.createOrImport({ listData: listData }, REQUEST_TYPE.FORM_DATA, UrlConstant.ORGANIZATION_EVALUATION.SEND_APPROVE_LEVEL1).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(this.translate.instant('common.notification.updateSuccess'));
          this.search();
          this.isSubmitted = false;
        }
      });
    }
  }

  confirm(listId: any, isConfirm: string) {
    this.service.createOrImport({
      listId: listId,
      isConfirm: isConfirm
    }, REQUEST_TYPE.FORM_DATA, UrlConstant.ORGANIZATION_EVALUATION.CONFIRM_LEVEL1).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
    });
  }

}

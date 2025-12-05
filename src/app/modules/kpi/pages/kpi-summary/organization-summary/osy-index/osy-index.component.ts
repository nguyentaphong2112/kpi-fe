import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { Scopes } from '@core/utils/common-constants';
import {
  EmployeeEvaluationsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/employee-evaluations.service';
import { CategoriesService } from '@app/modules/kpi/data-access/other-services/categories.service';
import {
  OrganizationEvaluationsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/organization-evaluations.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { FormGroup, Validators } from '@angular/forms';
import { BaseResponse } from '@core/models/base-response';
import { $e } from 'codelyzer/angular/styles/chars';
import { REQUEST_TYPE, TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { HbtTableComponent } from '@shared/component/hbt-table/hbt-table.component';
import {
  EvaluationResultsService
} from '@app/modules/hrm/data-access/services/staff-research/evaluation-results.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-osy-index',
  templateUrl: './osy-index.component.html',
  styleUrls: ['./osy-index.component.scss']
})
export class OsyIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  functionCode = Constant.FUNCTION_CODE.ORGANIZATION_SUMMARY;
  urlLoadPeriod = UrlConstant.GET_EVALUATION_PERIODS;
  microService = MICRO_SERVICE;
  scope = Scopes.VIEW;
  statusCodeList: NzSafeAny[] = [];
  searchStatusCodeList: NzSafeAny[] = [];
  levelList: NzSafeAny[] = [];
  statusCodes = Constant.KPI_ORGANIZATION_EVALUATION_STATUS;
  groupCodeList = [];
  orgTypeList = [];
  isVisible = false;
  isVisibleManage = false;
  formModal: FormGroup;
  formModalManage: FormGroup;
  listStatusCode: string[] = [];
  listPeriod = [];

  @ViewChild('statusTmpl', { static: true }) statusTmpl!: TemplateRef<NzSafeAny>;
  @ViewChild('tableTmpl') table!: HbtTableComponent;

  constructor(
    injector: Injector,
    private readonly service: OrganizationEvaluationsService,
    private readonly categoryService: CategoriesService,
    private readonly evaluationResultsService: EvaluationResultsService
  ) {
    super(injector);
    this.getDataSelect();
    this.isShowAdvSearch = true;
    this.exportApi = (body) => this.service.exportOrgSummary(CommonUtils.convertDataSendToServer(body, true));
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination);
    this.key = 'organizationEvaluationId';
    this.isCustomSearch = true;
  }

  ngOnInit() {
    this.initFormSearch();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.setHeaders();
    this.initAction();
  }

  override search(page?: number) {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const params = this.form.value;
    this.pagination.pageSize = this.form.controls['type'].value != '1' ? 999 : TABLE_CONFIG_DEFAULT.pageSize;
    this.pagination.pageNumber = page ?? 1;
    this.searchApi(params, this.pagination.getCurrentPage())
      .subscribe((res: BaseResponse<any>) => {
          this.responseSearch = res;
          if (this.form.controls['type'].value == '2') {
            this.tableData = [];
            const listData = this.groupCodeList.filter(it => this.form.controls['groupCodes'].value.includes(it.code));
            for (let i = 0; i < listData.length; i++) {
              const categoryData = listData[i];
              const orgIds = categoryData.attributes['ORG_IDS'].split(',');
              const data = res.data.listData.filter(it => orgIds.includes(it.organizationId.toString()));
              this.tableData.push({ isCustomFieldTr: categoryData.name });
              this.tableData = this.tableData.concat(data);
            }
          } else if (this.form.controls['type'].value == '3') {
            this.tableData = [];
            const listData = this.orgTypeList.filter(it => this.form.controls['orgTypeIdList'].value.includes(it.value));
            for (let i = 0; i < listData.length; i++) {
              const categoryData = listData[i];
              const data = res.data.listData.filter(it => categoryData.value == it.orgTypeId);
              this.tableData.push({ isCustomFieldTr: categoryData.name });
              this.tableData = this.tableData.concat(data);
            }
          } else {
            this.tableData = res.data.listData;
          }
          this.tableConfig.total = res.data.total;
          this.tableConfig.pageSize = res.data.pageSize;
          this.tableConfig.pageIndex = res.data.pageIndex;
        }
      );
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'kpi.employeeSummary.label.evaluationManage',
          icon: 'edit',
          isShowFn: (evt: any) => evt.status == Constant.STATUS.DA_XAC_NHAN_KQ_DANH_GIA && this.objFunction?.edit,
          function: this.doOpenModalManage
        }),
        new ChildActionSchema({
          label: 'kpi.employeeSummary.label.evaluationSchool',
          icon: 'setting',
          isShowFn: (evt: any) => evt.status == Constant.STATUS.DA_XAC_NHAN_KQ_DANH_GIA && this.objFunction?.review,
          function: this.doOpenModal
        })
      ]
    });
  }

  handleOk() {
    const data = CommonUtils.convertDataSendToServer(this.formModal.value);
    this.service.update({
      ...data,
      id: data.organizationEvaluationId
    }, REQUEST_TYPE.DEFAULT, '/update-emp-summary').subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.isVisible = false;
        this.formModal.reset();
        this.search();
      }
    });
  }

  handleOkManage() {
    const data = CommonUtils.convertDataSendToServer(this.formModalManage.value);
    this.service.update({
      ...data,
      id: data.organizationEvaluationId
    }, REQUEST_TYPE.DEFAULT, '/manager-update-emp-summary').subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.isVisibleManage = false;
        this.formModalManage.reset();
        this.search();
      }
    });
  }

  handleCancel() {
    this.isVisible = false;
    this.formModal.reset();
  }

  handleCancelManage() {
    this.isVisibleManage = false;
    this.formModalManage.reset();
  }

  checkChangeMapData(mapData: NzSafeAny) {
    this.listStatusCode = Array.from(mapData?.values())?.map((item: NzSafeAny) => {
      return item.status;
    }) ?? [];
  }


  doOpenModal = (data) => {
    this.isVisible = true;
    this.formModal.patchValue(data);
  };

  doOpenModalManage = (data) => {
    this.isVisibleManage = true;
    this.formModalManage.patchValue(data);
  };

  changeType($event) {
    if ($event) {
      this.isSubmitted = false;
      this.form.controls['groupCodes'].setValue([]);
      this.form.controls['orgTypeIdList'].setValue(null);
      this.form.controls['level'].setValue(null);
      this.form.controls['groupCodes'].setValidators($event == 2 ? Validators.required : null);
      this.form.controls['orgTypeIdList'].setValidators($event == 3 ? Validators.required : null);
      this.form.controls['level'].setValidators($event == 4 ? Validators.required : null);
      this.form.controls['groupCodes'].setErrors(null);
      this.form.controls['orgTypeIdList'].setErrors(null);
      this.form.controls['level'].setValue(null);
      this.form.controls['groupCodes'].updateValueAndValidity({ emitEvent: false });
      this.form.controls['orgTypeIdList'].updateValueAndValidity({ emitEvent: false });
      this.form.controls['level'].updateValueAndValidity({ emitEvent: false });
    }
  }

  finalResult(data?: any) {
    this.service.finalResult(data).subscribe((res: BaseResponse<any>) => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(
          this.translate.instant('common.notification.callSuccess', { title: this.translate.instant('common.button.finalResult') })
        );
        this.search();
        this.refreshListCheckBox();
      }
    });
  }

  refreshListCheckBox() {
    this.table?.resetAllCheckBoxFn();
    this.listId = [];
  }


  getDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', Constant.CATEGORY.KPI_ORGANIZATION_EVALUATION_STATUS))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.statusCodeList = res.data.map((item: NzSafeAny) => {
            if ([this.statusCodes.KHOI_TAO, this.statusCodes.DU_THAO, this.statusCodes.YC_DANH_GIA_LAI].includes(item.code)) {
              item.color = '#141ED2';
              item.bgColor = '#E9EAFF';
            } else if ([this.statusCodes.CHO_XET_DUYET, this.statusCodes.CHO_PHE_DUYET, this.statusCodes.CHO_QLTT_DANH_GIA, Constant.STATUS.CHO_QLTT_DANH_GIA_LAI].includes(item.code)) {
              item.color = '#F99600';
              item.bgColor = '#FFF2DA';
            } else if ([this.statusCodes.TU_CHOI_PHE_DUYET, this.statusCodes.TU_CHOI_XET_DUYET].includes(item.code)) {
              item.color = '#FA0B0B';
              item.bgColor = '#FDE7EA';
            } else {
              item.color = '#06A561';
              item.bgColor = '#DAF9EC';
            }
            return item;
          });
          this.searchStatusCodeList = res.data.filter((item: NzSafeAny) =>
            [this.statusCodes.DANH_GIA, this.statusCodes.QLTT_DANH_GIA].includes(item.code)
          );
        }
      });

    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_PHAN_NHOM) + '?isGetAttribute=true')
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.groupCodeList = res.data;
        }
      });

    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.LOAI_HINH_DON_VI))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.orgTypeList = res.data;
        }
      });
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_LEVEL))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.levelList = res.data.filter(it => it.value == 2 || it.value == 3);
        }
      });

    this.evaluationResultsService.getList({ evaluationType: 2 }, '/evaluation_periods').subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listPeriod = res.data;
        if (this.listPeriod?.length > 0) {
          this.form.controls['evaluationPeriodId'].setValue(this.listPeriod[0].evaluationPeriodId);
        }
      }
    });

  }


  initFormSearch() {
    this.form = this.fb.group({
      evaluationPeriodId: [null],
      keySearch: null,
      status: [null],
      type: ['1', Validators.required],
      groupCodes: [null],
      orgTypeIdList: [null],
      isSynthetic: 'Y',
      level: [null]
    });
    this.formModal = this.fb.group({
      organizationEvaluationId: [null],
      finalPoint: [null],
      finalResultId: [null]
    });
    this.formModalManage = this.fb.group({
      organizationEvaluationId: [null],
      resultId: [null]
    });
    this.form.controls['evaluationPeriodId'].valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
      if (value) {
        setTimeout(() => {
          this.search();
        });
      }
    });
  }

  override setHeaders() {
    this.tableConfig = {
      headers: [
        {
          title: 'STT',
          thClassList: ['text-center'],
          tdClassList: ['text-center'],
          fixed: true,
          fixedDir: 'left',
          width: 50,
          rowspan: 2
        },
        {
          title: 'kpi.organizationSummary.label.org',
          field: 'organizationName',
          thClassList: ['text-center'],
          rowspan: 2,
          width: 350
        },
        {
          title: 'kpi.employeeSummary.label.selfRating',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 140,
          child: [
            {
              title: 'kpi.employeeSummary.label.point',
              field: 'selfTotalPoint',
              tdClassList: ['text-center'],
              thClassList: ['text-center'],
              width: 140
            }
          ]
        },
        {
          title: 'kpi.employeeSummary.label.managerRating',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 70,
          colspan: 3,
          child: [
            {
              title: 'kpi.employeeSummary.label.point',
              field: 'managerTotalPoint',
              tdClassList: ['text-center'],
              thClassList: ['text-center'],
              width: 70
            },
            {
              title: 'kpi.employeeSummary.label.evaluationPoint',
              field: 'managerGrade',
              tdClassList: ['text-center'],
              thClassList: ['text-center'],
              width: 70
            },
            {
              title: 'kpi.employeeSummary.label.evaluationManage',
              field: 'resultId',
              tdClassList: ['text-center'],
              thClassList: ['text-center'],
              width: 70
            }
          ]
        },
        {
          title: 'kpi.organizationSummary.label.status',
          fieldType: 'tdTemplate',
          fieldTypeValue: this.statusTmpl,
          rowspan: 2,
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 200
        },
        {
          title: 'kpi.organizationSummary.label.createdTime',
          field: 'createdTime',
          show: false,
          rowspan: 2,
          width: 150
        },
        {
          title: 'kpi.organizationSummary.label.createdBy',
          field: 'createdBy',
          rowspan: 2,
          show: false,
          width: 150
        },
        {
          title: 'kpi.organizationSummary.label.approvedTime',
          field: 'approvedTime',
          rowspan: 2,
          show: false,
          width: 150
        },
        {
          title: 'kpi.organizationSummary.label.approvedBy',
          field: 'approvedBy',
          rowspan: 2,
          show: false,
          width: 150
        },
        {
          title: 'kpi.organizationSummary.label.modifiedTime',
          field: 'modifiedTime',
          rowspan: 2,
          show: false,
          width: 150
        },
        {
          title: 'kpi.organizationSummary.label.modifiedBy',
          field: 'modifiedBy',
          rowspan: 2,
          show: false,
          width: 150
        },
        {
          title: ' ',
          field: 'action',
          tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
          width: 50,
          fieldType: 'tdTemplate',
          fieldTypeValue: this.actionTpl,
          fixed: window.innerWidth > 1024,
          fixedDir: 'right',
          rowspan: 2
        }
      ],
      total: 0,
      needScroll: true,
      loading: false,
      size: 'small',
      pageSize: TABLE_CONFIG_DEFAULT.pageSize,
      pageIndex: 1,
      showSelect: false,
      key: 'organizationEvaluationId'
    };
  }

}

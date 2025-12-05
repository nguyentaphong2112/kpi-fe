import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { Scopes } from '@core/utils/common-constants';
import {
  EmployeeEvaluationsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/employee-evaluations.service';
import { CategoriesService } from '@app/modules/kpi/data-access/other-services/categories.service';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { CommonUtils } from '@shared/services/common-utils.service';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { FormGroup } from '@angular/forms';
import { CATEGORY_CODE, REQUEST_TYPE, TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { BaseResponse } from '@core/models/base-response';
import { HbtTableComponent } from '@shared/component/hbt-table/hbt-table.component';
import { distinctUntilChanged } from 'rxjs';
import {
  EvaluationResultsService
} from '@app/modules/hrm/data-access/services/staff-research/evaluation-results.service';

@Component({
  selector: 'app-esy-index',
  templateUrl: './esy-index.component.html',
  styleUrls: ['./esy-index.component.scss']
})
export class EsyIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {

  functionCode = Constant.FUNCTION_CODE.EMPLOYEE_SUMMARY;
  urlLoadPeriod = UrlConstant.GET_EVALUATION_PERIODS;
  microService = MICRO_SERVICE;
  scope = Scopes.VIEW;
  statusCodeList: NzSafeAny[] = [];
  searchStatusCodeList: NzSafeAny[] = [];
  statusCodes = Constant.KPI_EMPLOYEE_EVALUATION_STATUS;
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
    private readonly service: EmployeeEvaluationsService,
    private readonly categoryService: CategoriesService,
    private readonly evaluationResultsService: EvaluationResultsService
  ) {
    super(injector);
    this.initFormSearch();
    this.getDataSelect();
    this.exportApi = (body) => this.service.exportEmpSummary(CommonUtils.convertDataSendToServer(body, true));
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination);
    this.key = 'employeeEvaluationId';
    this.isCustomSearch = true;
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();

  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'kpi.employeeSummary.label.evaluationManage',
          icon: 'edit',
          isShowFn: (evt: any) => evt.status == Constant.STATUS.DA_XAC_NHAN_KQ_DANH_GIA && this.objFunction.edit,
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
      id: data.employeeEvaluationId
    }, REQUEST_TYPE.DEFAULT, '/update-emp-summary').subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.isVisible = false;
        this.formModal.reset();
        this.search();
      }
    });
  }

  checkChangeMapData(mapData: NzSafeAny) {
    this.listStatusCode = Array.from(mapData?.values())?.map((item: NzSafeAny) => {
      return item.status;
    }) ?? [];
  }

  handleOkManage() {
    const data = CommonUtils.convertDataSendToServer(this.formModalManage.value);
    this.service.update({
      ...data,
      id: data.employeeEvaluationId
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


  doOpenModal = (data) => {
    this.isVisible = true;
    this.formModal.patchValue(data);
  };

  doOpenModalManage = (data) => {
    this.isVisibleManage = true;
    this.formModalManage.patchValue(data);
  };


  getDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', Constant.CATEGORY.KPI_EMPLOYEE_EVALUATION_STATUS))
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
      isSynthetic: 'Y',
      status: [null]
    });
    this.formModal = this.fb.group({
      employeeEvaluationId: [null],
      finalPoint: [null],
      finalResultId: [null]
    });
    this.formModalManage = this.fb.group({
      employeeEvaluationId: [null],
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
          title: 'kpi.employeeSummary.label.employeeCode',
          field: 'employeeCode',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 70,
          rowspan: 2
        },
        {
          title: 'kpi.employeeSummary.label.employeeName',
          field: 'employeeName',
          thClassList: ['text-center'],
          width: 200,
          rowspan: 2
        },
        {
          title: 'kpi.employeeSummary.label.jobName',
          field: 'jobName',
          thClassList: ['text-center'],
          width: 200,
          rowspan: 2
        },
        {
          title: 'kpi.employeeSummary.label.orgName',
          field: 'orgName',
          thClassList: ['text-center'],
          width: 300,
          rowspan: 2
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
          title: 'kpi.employeeSummary.label.status',
          fieldType: 'tdTemplate',
          fieldTypeValue: this.statusTmpl,
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 200,
          rowspan: 2
        },
        {
          title: 'kpi.employeeSummary.label.createdTime',
          field: 'createdTime',
          width: 150,
          show: false,
          rowspan: 2
        },
        {
          title: 'kpi.employeeSummary.label.createdBy',
          field: 'createdBy',
          width: 150,
          show: false,
          rowspan: 2
        },
        {
          title: 'kpi.employeeSummary.label.approvedTime',
          field: 'approvedTime',
          width: 150,
          show: false,
          rowspan: 2
        },
        {
          title: 'kpi.employeeSummary.label.approvedBy',
          field: 'approvedBy',
          width: 150,
          show: false,
          rowspan: 2
        },
        {
          title: 'kpi.employeeSummary.label.modifiedTime',
          field: 'modifiedTime',
          show: false,
          width: 150,
          rowspan: 2
        },
        {
          title: 'kpi.employeeSummary.label.modifiedBy',
          field: 'modifiedBy',
          show: false,
          width: 150,
          rowspan: 2
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
      key: 'employeeEvaluationId'
    };
  }

}

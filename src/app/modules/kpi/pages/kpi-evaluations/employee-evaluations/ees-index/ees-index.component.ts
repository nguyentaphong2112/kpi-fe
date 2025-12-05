import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EmployeeEvaluationsModel } from '../../../../data-access/models/kpi-evaluations/employee-evaluations.model';
import {
  EmployeeEvaluationsService
} from '../../../../data-access/services/kpi-evaluations/employee-evaluations.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { REQUEST_TYPE, TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { Scopes } from '@core/utils/common-constants';
import { Utils } from '@core/utils/utils';
import { FunctionCode } from '@shared/enums/enums-constant';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CategoriesService } from '@app/modules/kpi/data-access/other-services/categories.service';
import {
  ListEvaluationComponent
} from '@app/modules/kpi/pages/kpi-evaluations/employee-evaluations/list-evaluation/list-evaluation.component';
import { BaseResponse } from '@core/models/base-response';
import { HbtTableComponent } from '@shared/component/hbt-table/hbt-table.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { distinctUntilChanged } from 'rxjs';
import {
  EvaluationResultsService
} from '@app/modules/hrm/data-access/services/staff-research/evaluation-results.service';

@Component({
  selector: 'app-pes-index',
  templateUrl: './ees-index.component.html',
  styleUrls: ['./ees-index.component.scss']
})


export class EesIndexComponent extends BaseListComponent<EmployeeEvaluationsModel> implements OnInit {
  functionCode = Constant.FUNCTION_CODE.EMPLOYEE_EVALUATE;
  functionCodeEmployee = FunctionCode.HR_PERSONAL_INFO;
  microService = MICRO_SERVICE;
  scope = Scopes.VIEW;
  urlLoadPeriod = UrlConstant.GET_EVALUATION_PERIODS;
  employeeEvaluationId = null;
  isShowAdvSearch = false;
  listStatusCode: string[] = [];
  statusCodeList: NzSafeAny[] = [];
  statusCodes = Constant.KPI_EMPLOYEE_EVALUATION_STATUS;
  isVisible = false;
  valueInput = '';
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
    this.nameLocalSearch = 'search-evaluations-emp-evaluation';
    this.nameLocalForm = 'evaluations-ees-form';
    this.key = 'employeeEvaluationId';
    this.initFormSearch();
    this.getDataSelect();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true), '/export/evaluation');
    this.rejectByListApi = (listId: number[], rejectReason: string, afterUrl?: string) => this.service.rejectByList(listId, rejectReason, '/adjust-manage-evaluate');
    this.formConfig = {
      title: 'kpi.employeeEvaluations.label.listEvaluation',
      content: ListEvaluationComponent
    };
    this.isCustomSearch = true;
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
  }


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
      employeeId: [null],
      organizationId: [null],
      evaluationPeriodId: [null],
      keySearch: null,
      isEvaluation: 'Y',
      statusList: [null]
    });

    this.form.controls['evaluationPeriodId'].valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
      if (value) {
        setTimeout(() => {
          this.search();
        });
      }
    });
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.view',
          icon: 'eye',
          isShow: this.objFunction?.view,
          function: (evt: any) => {
            this.navigateEdit(evt.employeeName, evt.employeeCode, evt.employeeEvaluationId, evt.employeeId, true, true);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.evaluate',
          icon: 'form',
          isShowFn: (evt: any) => (evt.status === Constant.STATUS.PHE_DUYET || evt.status === Constant.STATUS.DANH_GIA || evt.status === Constant.STATUS.YC_DANH_GIA_LAI) && this.objFunction.edit,
          function: (evt: any) => {
            this.navigateEdit(evt.employeeName, evt.employeeCode, evt.employeeEvaluationId, evt.employeeId, true, null, true);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.sendEvaluate',
          icon: 'send',
          isShowFn: (evt: any) => evt.status === Constant.STATUS.DANH_GIA && this.objFunction.edit,
          function: (evt: any) => {
            this.updateStatus(evt.employeeEvaluationId, Constant.STATUS.CHO_QLTT_DANH_GIA);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.adjustEvaluate',
          icon: 'send',
          isShowFn: (evt: any) => (evt.status === Constant.STATUS.QLTT_DANH_GIA || evt.status === Constant.STATUS.CHO_QLTT_DANH_GIA) && this.objFunction.approve,
          function: (evt: any) => {
            this.openModal(evt.employeeEvaluationId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.adjustManageEvaluate',
          icon: 'send',
          isShowFn: (evt: any) => [Constant.STATUS.QLTT_DANH_GIA].includes(evt.status) && this.objFunction.review,
          function: this.doRejectById
        }),
        new ChildActionSchema({
          label: 'common.button.evaluateManage',
          icon: 'form',
          isShowFn: (evt: any) => (evt.status === Constant.STATUS.CHO_QLTT_DANH_GIA || evt.status === Constant.STATUS.QLTT_DANH_GIA || evt.status === Constant.STATUS.CHO_QLTT_DANH_GIA_LAI) && this.objFunction.approve,
          function: (evt: any) => {
            this.navigateEdit(evt.employeeName, evt.employeeCode, evt.employeeEvaluationId, evt.employeeId, true, null, true, true);
          }
        })
      ]
    });
  }

  openModal(id: number) {
    this.isVisible = true;
    this.isSubmitted = false;
    this.employeeEvaluationId = id;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.valueInput = '';
  }

  handleOk(): void {
    this.isSubmitted = true;
    if (this.valueInput.trim()) {
      this.updateStatus(this.employeeEvaluationId, Constant.STATUS.YC_DANH_GIA_LAI, this.valueInput, true);
    }
  }


  updateStatus(id: NzSafeAny, status: string, reason = '', isAdjust = false) {
    this.service.update({
      id: id,
      status: status,
      reason: reason
    }, REQUEST_TYPE.DEFAULT, isAdjust ? UrlConstant.EMPLOYEE_EVALUATION.STATUS_APPROVED : UrlConstant.EMPLOYEE_EVALUATION.STATUS).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.isVisible = false;
        this.search();
      }
    });
  }

  exportById(id: number) {
    this.service.export(null, UrlConstant.EMPLOYEE_EVALUATION.EXPORT_EVALUATE + id).toPromise();
  }

  checkChangeMapData(mapData: NzSafeAny) {
    this.listStatusCode = Array.from(mapData?.values())?.map((item: NzSafeAny) => {
      return item.status;
    }) ?? [];
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
          width: 50
        },
        {
          title: 'kpi.employeeEvaluations.label.employeeCode',
          field: 'employeeCode',
          thClassList: ['text-center'],
          width: 70
        },
        {
          title: 'kpi.employeeEvaluations.label.employeeName',
          field: 'employeeName',
          thClassList: ['text-center'],
          width: 200
        },
        {
          title: 'kpi.employeeEvaluations.label.status',
          fieldType: 'tdTemplate',
          fieldTypeValue: this.statusTmpl,
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 200
        },
        {
          title: 'kpi.employeeEvaluations.label.selfTotalPoint',
          field: 'selfTotalPoint',
          thClassList: ['text-center'],
          tdClassList: ['text-right'],
          width: 120
        },
        {
          title: 'kpi.employeeEvaluations.label.managerTotalPoint',
          field: 'managerTotalPoint',
          thClassList: ['text-center'],
          tdClassList: ['text-right'],
          width: 120
        },
        {
          title: 'kpi.employeeEvaluations.label.jobName',
          field: 'jobName',
          thClassList: ['text-center'],
          width: 200
        },
        {
          title: 'kpi.employeeEvaluations.label.orgName',
          field: 'orgName',
          thClassList: ['text-center'],
          width: 300
        },
        {
          title: 'kpi.employeeEvaluations.label.period',
          field: 'evaluationPeriodName',
          thClassList: ['text-center'],
          width: 300
        },
        {
          title: 'kpi.employeeEvaluations.label.reason',
          field: 'reason',
          thClassList: ['text-center'],
          width: 200
        },
        {
          title: 'kpi.employeeEvaluations.label.reasonManageRequest',
          field: 'reasonManageRequest',
          thClassList: ['text-center'],
          width: 200
        },
        {
          title: 'kpi.employeeEvaluations.label.createdTime',
          field: 'createdTime',
          width: 150,
          show: false
        },
        {
          title: 'kpi.employeeEvaluations.label.createdBy',
          field: 'createdBy',
          width: 150,
          show: false
        },
        {
          title: 'kpi.employeeEvaluations.label.approvedTime',
          field: 'approvedTime',
          width: 150,
          show: false
        },
        {
          title: 'kpi.employeeEvaluations.label.approvedBy',
          field: 'approvedBy',
          width: 150,
          show: false
        },
        {
          title: 'kpi.employeeEvaluations.label.modifiedTime',
          field: 'modifiedTime',
          show: false,
          width: 150
        },
        {
          title: 'kpi.employeeEvaluations.label.modifiedBy',
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
      ],
      total: 0,
      needScroll: true,
      loading: false,
      size: 'small',
      pageSize: TABLE_CONFIG_DEFAULT.pageSize,
      pageIndex: 1,
      showSelect: true,
      key: 'employeeEvaluationId'
    };
  };

  getPeriod($event) {
    if ($event) {
      this.urlLoadPeriod = UrlConstant.GET_EVALUATION_PERIODS + '?year=' + Utils.convertDateToSendServer($event, 'yyyy');
    } else {
      this.urlLoadPeriod = null;
    }
  }

  navigateEdit(employeeName?: string, employeeCode?: string, employeeEvaluationId?: number, employeeId?: number, isDetail = null, isEvaluateDetail = null, isEvaluate = null, isEvaluateManage = null) {
    this.router.navigate(['/kpi/kpi-evaluations/employee-evaluations/form'],
      {
        queryParams: {
          employeeName,
          employeeCode,
          employeeEvaluationId,
          employeeId,
          isDetail,
          isEvaluateDetail,
          isEvaluate,
          isEvaluateManage
        }
      });
  }

  navigateEvaluation(listId?: any[]) {
    this.router.navigate(['/kpi/kpi-evaluations/employee-evaluations/list-evaluation'],
      {
        queryParams: {
          listId
        }
      });
  }

  confirmResult(data?: any) {
    this.service.confirmResult(data).subscribe((res: BaseResponse<any>) => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(
          this.translate.instant('common.notification.callSuccess', { title: this.translate.instant('common.button.confirmResult') })
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

}


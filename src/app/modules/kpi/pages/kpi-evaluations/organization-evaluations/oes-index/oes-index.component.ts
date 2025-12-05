import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  OrganizationEvaluationsService
} from '../../../../data-access/services/kpi-evaluations/organization-evaluations.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { Scopes } from '@core/utils/common-constants';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { REQUEST_TYPE, TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import {
  EvaluationPeriodsService
} from '@app/modules/kpi/data-access/services/kpi-managers/evaluation-periods.service';
import { CategoriesService } from '@app/modules/kpi/data-access/other-services/categories.service';
import { distinctUntilChanged, take } from 'rxjs';
import { CommonUtils } from '@shared/services/common-utils.service';
import { BaseResponse } from '@core/models/base-response';
import { HbtTableComponent } from '@shared/component/hbt-table/hbt-table.component';
import {
  EvaluationResultsService
} from '@app/modules/hrm/data-access/services/staff-research/evaluation-results.service';

@Component({
  selector: 'app-oes-index',
  templateUrl: './oes-index.component.html',
  styleUrls: ['./oes-index.component.scss']
})


export class OesIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  functionCode = Constant.FUNCTION_CODE.ORGANIZATION_EVALUATE;
  microService = MICRO_SERVICE;
  scope = Scopes.VIEW;
  urlLoadPeriod = UrlConstant.GET_EVALUATION_PERIODS;
  organizationEvaluationId = null;
  isShowAdvSearch = false;
  statusCodeList: NzSafeAny[] = [];
  statusCodes = Constant.KPI_ORGANIZATION_EVALUATION_STATUS;
  isVisible = false;
  valueInput = '';
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
    this.nameLocalSearch = 'search-evaluations-org-evaluation';
    this.nameLocalForm = 'evaluations-oes-form';
    this.initFormSearch();
    this.getDataSelect();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true), '/export/evaluation');
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination);
    this.rejectByListApi = (listId: number[], rejectReason: string, afterUrl?: string) => this.service.rejectByList(listId, rejectReason, '/adjust-manage-evaluate');
    this.key = 'organizationEvaluationId';
    this.isCustomSearch = true;
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
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
      keySearch: [null],
      organizationId: [null],
      evaluationPeriodId: [null],
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
            this.navigateEdit(evt.organizationId, evt.organizationEvaluationId, true, true, true);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.evaluate',
          icon: 'form',
          isShowFn: (evt: any) => (evt.status === Constant.STATUS.PHE_DUYET || evt.status === Constant.STATUS.DANH_GIA || evt.status === Constant.STATUS.YC_DANH_GIA_LAI) && this.objFunction.edit,
          function: (evt: any) => {
            this.navigateEdit(evt.organizationId, evt.organizationEvaluationId, true, null, true);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.sendEvaluate',
          icon: 'send',
          isShowFn: (evt: any) => evt.status === Constant.STATUS.DANH_GIA && this.objFunction.edit,
          function: (evt: any) => {
            this.updateStatus(evt.organizationEvaluationId, Constant.STATUS.CHO_QLTT_DANH_GIA);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.adjustEvaluateOrg',
          icon: 'send',
          isShowFn: (evt: any) => (evt.status === Constant.STATUS.QLTT_DANH_GIA || evt.status === Constant.STATUS.CHO_QLTT_DANH_GIA) && this.objFunction.approve,
          function: (evt: any) => {
            this.openModal(evt.organizationEvaluationId);
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
            this.navigateEdit(evt.organizationId, evt.organizationEvaluationId, true, null, true, true);
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
      this.updateStatus(this.organizationEvaluationId, Constant.STATUS.YC_DANH_GIA_LAI, this.valueInput, true);
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

  checkChangeMapData(mapData: NzSafeAny) {
    this.listStatusCode = Array.from(mapData?.values())?.map((item: NzSafeAny) => {
      return item.status;
    }) ?? [];
  }

  exportById(id: number) {
    this.service.export(null, UrlConstant.ORGANIZATION_EVALUATION.EXPORT_EVALUATE + id).toPromise();
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
          title: 'kpi.kpiEvaluations.organizations.table.period',
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
      ],
      total: 0,
      needScroll: true,
      loading: false,
      size: 'small',
      pageSize: TABLE_CONFIG_DEFAULT.pageSize,
      pageIndex: 1,
      showSelect: true,
      key: 'organizationEvaluationId'
    };
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


  navigateEdit(organizationId?: string, organizationEvaluationId?: string, isDetail = null, isEvaluateDetail = null, isEvaluate = null, isEvaluateManage = null) {
    this.router.navigate(['/kpi/kpi-evaluations/organization-evaluations/form'],
      {
        queryParams: {
          organizationId,
          organizationEvaluationId,
          isDetail,
          isEvaluateDetail,
          isEvaluate,
          isEvaluateManage
        }
      });
  }
}


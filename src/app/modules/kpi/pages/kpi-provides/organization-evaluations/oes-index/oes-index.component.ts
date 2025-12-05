import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  OrganizationEvaluationsService
} from '../../../../data-access/services/kpi-evaluations/organization-evaluations.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE, STORAGE_NAME } from '@core/constant/system.constants';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { Scopes } from '@core/utils/common-constants';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { REQUEST_TYPE } from '@shared/constant/common';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { CategoriesService } from '@app/modules/kpi/data-access/other-services/categories.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import {
  EvaluationResultsService
} from '@app/modules/hrm/data-access/services/staff-research/evaluation-results.service';
import { distinctUntilChanged } from 'rxjs';
import { StorageService } from '@core/services/storage.service';

@Component({
  selector: 'app-oes-index',
  templateUrl: './oes-index.component.html',
  styleUrls: ['./oes-index.component.scss']
})


export class OesIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  functionCode = Constant.FUNCTION_CODE.ORGANIZATION_EVALUATION;
  microService = MICRO_SERVICE;
  scope = Scopes.VIEW;
  urlLoadPeriod = UrlConstant.GET_EVALUATION_PERIODS;
  organizationEvaluationId = null;
  isShowAdvSearch = false;
  statusCodeList: NzSafeAny[] = [];
  isVisible = false;
  valueInput = '';
  statusCodes = Constant.KPI_ORGANIZATION_EVALUATION_STATUS;
  listPeriod = [];
  employeeCode = null;

  @ViewChild('statusTmpl', { static: true }) statusTmpl!: TemplateRef<NzSafeAny>;

  constructor(
    injector: Injector,
    private readonly service: OrganizationEvaluationsService,
    private readonly categoryService: CategoriesService,
    private readonly evaluationResultsService: EvaluationResultsService
  ) {
    super(injector);
    this.nameLocalSearch = 'search-provides-org-evaluation';
    this.nameLocalForm = 'provides-oes-form';
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination);
    this.key = 'organizationEvaluationId';
    this.isCustomSearch = true;
  }

  ngOnInit() {
    this.employeeCode = StorageService.get(STORAGE_NAME.USER_LOGIN)?.employeeCode;
    this.getDataSelect();
    super.ngOnInit();
    this.initAction();
  }


  getDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', Constant.CATEGORY.KPI_ORGANIZATION_EVALUATION_STATUS))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.statusCodeList = res.data.map((item: NzSafeAny) => {
            if ([this.statusCodes.KHOI_TAO, this.statusCodes.DU_THAO, this.statusCodes.YC_DANH_GIA_LAI, this.statusCodes.YC_NHAP_LAI].includes(item.code)) {
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
          label: 'common.button.adjust',
          icon: 'setting',
          isShowFn: (evt: any) => evt.status === Constant.STATUS.PHE_DUYET && this.objFunction?.edit && this.objFunction?.approve,
          function: (evt: any) => {
            this.navigateEdit(evt.organizationId, evt.pathLevel, evt.evaluationPeriodId, evt.organizationEvaluationId, null, true);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShowFn: (evt: any) => ([Constant.STATUS.TU_CHOI_PHE_DUYET, Constant.STATUS.DU_THAO, Constant.STATUS.KHOI_TAO, Constant.STATUS.TU_CHOI_XET_DUYET, Constant.STATUS.YC_NHAP_LAI].includes(evt.status))
            && this.objFunction?.edit,
          function: (evt: any) => {
            this.navigateEdit(evt.organizationId, evt.pathLevel, evt.evaluationPeriodId, evt.organizationEvaluationId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.view',
          icon: 'eye',
          isShow: this.objFunction?.view,
          function: (evt: any) => {
            this.navigateEdit(evt.organizationId, evt.pathLevel, evt.evaluationPeriodId,
              evt.organizationEvaluationId, true, null, evt.status);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.adjustRequest',
          icon: 'send',
          isShowFn: (evt: any) => evt.status === Constant.STATUS.PHE_DUYET && this.objFunction.approve,
          function: (evt: any) => {
            this.openModal(evt.organizationEvaluationId);
          }
        }),
        // new ChildActionSchema({
        //   label: 'common.button.export',
        //   icon: 'upload',
        //   isShow: true,
        //   function: (evt: any) => {
        //     this.exportById(evt.organizationEvaluationId);
        //   }
        // }),
        new ChildActionSchema({
          label: 'common.button.send2',
          icon: 'send',
          isShowFn: (evt: any) => evt.status === Constant.STATUS.DU_THAO && this.objFunction?.edit,
          function: (evt: any) => {
            this.sendApprove(evt.organizationEvaluationId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.approve',
          icon: 'check',
          isShowFn: (evt: any) => evt.status === Constant.STATUS.CHO_PHE_DUYET && this.employeeCode != evt?.empManagerCode && this.objFunction.approve,
          function: (evt: any) => {
            this.updateApprove('OK', evt.organizationEvaluationId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.approve2',
          icon: 'check',
          isShowFn: (evt: any) => evt.status === Constant.STATUS.CHO_XET_DUYET && this.employeeCode != evt?.empManagerCode && this.objFunction.review,
          function: (evt: any) => {
            this.updateReview('OK', evt.organizationEvaluationId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.rejectApprove',
          icon: 'close',
          isShowFn: (evt: any) => evt.status === Constant.STATUS.CHO_PHE_DUYET && this.employeeCode != evt?.empManagerCode && this.objFunction.approve,
          function: (evt: any) => {
            this.updateApprove('NOT-OK', evt.organizationEvaluationId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.rejectApprove2',
          icon: 'close',
          isShowFn: (evt: any) => evt.status === Constant.STATUS.CHO_XET_DUYET && this.employeeCode != evt?.empManagerCode && this.objFunction.review,
          function: (evt: any) => {
            this.updateReview('NOT-OK', evt.organizationEvaluationId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShowFn: (evt: any) => (evt.status === Constant.STATUS.DU_THAO || evt.status === Constant.STATUS.KHOI_TAO) && this.objFunction?.delete,
          function: this.deleteItem
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


  sendApprove(id: NzSafeAny) {
    this.service.update({ id: id }, REQUEST_TYPE.DEFAULT, UrlConstant.ORGANIZATION_EVALUATION.SEND_APPROVE).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
    });
  }


  navigateEdit(organizationId?: string, pathLevel?: number, evaluationPeriodId?: number, organizationEvaluationId?: string,
               isDetail = null, isAdjust = null, status = null) {
    this.router.navigate(['/kpi/kpi-provides/organization-evaluations/form'],
      {
        queryParams: {
          organizationId, pathLevel, evaluationPeriodId, organizationEvaluationId, isDetail, isAdjust, status
        }
      });
  }

  exportById(id: number) {
    this.service.export(null, UrlConstant.ORGANIZATION_EVALUATION.EXPORT + id).toPromise();
  }

}


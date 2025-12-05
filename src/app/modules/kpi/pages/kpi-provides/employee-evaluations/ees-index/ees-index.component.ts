import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EmployeeEvaluationsModel } from '../../../../data-access/models/kpi-evaluations/employee-evaluations.model';
import {
  EmployeeEvaluationsService
} from '../../../../data-access/services/kpi-evaluations/employee-evaluations.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { REQUEST_TYPE } from '@shared/constant/common';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { Scopes } from '@core/utils/common-constants';
import { FunctionCode } from '@shared/enums/enums-constant';
import {
  EvaluationPeriodsService
} from '@app/modules/kpi/data-access/services/kpi-managers/evaluation-periods.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CategoriesService } from '@app/modules/kpi/data-access/other-services/categories.service';
import { distinctUntilChanged, take } from 'rxjs';
import { CommonUtils } from '@shared/services/common-utils.service';
import {
  EvaluationResultsService
} from '@app/modules/hrm/data-access/services/staff-research/evaluation-results.service';

@Component({
  selector: 'app-pes-index',
  templateUrl: './ees-index.component.html',
  styleUrls: ['./ees-index.component.scss']
})


export class EesIndexComponent extends BaseListComponent<EmployeeEvaluationsModel> implements OnInit {
  functionCode = Constant.FUNCTION_CODE.EMPLOYEE_EVALUATIONS;
  functionCodeEmployee = FunctionCode.HR_PERSONAL_INFO;
  microService = MICRO_SERVICE;
  scope = Scopes.VIEW;
  urlLoadPeriod = UrlConstant.GET_EVALUATION_PERIODS;
  isVisible = false;
  valueInput = '';
  employeeEvaluationId = null;
  isSubmittedModal = false;
  isShowAdvSearch = false;
  statusCodeList: NzSafeAny[] = [];
  statusCodes = Constant.KPI_EMPLOYEE_EVALUATION_STATUS;
  listPeriod = [];

  @ViewChild('statusTmpl', { static: true }) statusTmpl!: TemplateRef<NzSafeAny>;

  constructor(
    injector: Injector,
    private readonly service: EmployeeEvaluationsService,
    private readonly categoryService: CategoriesService,
    private readonly evaluationResultsService: EvaluationResultsService
  ) {
    super(injector);
    this.nameLocalSearch = 'search-provides-emp-evaluation';
    this.nameLocalForm = 'provides-ees-form';
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination);
    this.key = 'resourceId';
    this.isCustomSearch = true;
  }

  ngOnInit() {
    this.getDataSelect();
    super.ngOnInit();
    this.initAction();
  }


  getDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', Constant.CATEGORY.KPI_EMPLOYEE_EVALUATION_STATUS))
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
      employeeId: [null],
      organizationId: [null],
      evaluationPeriodId: [null],
      keySearch: null,
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
        new ChildActionSchema(
          {
            label: 'common.button.adjust',
            icon: 'setting',
            isShowFn: (evt: any) => evt.status === Constant.STATUS.PHE_DUYET
              && this.objFunction?.edit && this.objFunction?.approve,
            function: (evt: any) => {
              this.navigateEdit(evt.employeeName, evt.employeeCode, evt.employeeEvaluationId, evt.employeeId, evt.evaluationPeriodId, null, true);
            }
          }),
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShowFn: (evt: any) => ([Constant.STATUS.TU_CHOI_PHE_DUYET, Constant.STATUS.DU_THAO, Constant.STATUS.KHOI_TAO, Constant.STATUS.TU_CHOI_XET_DUYET, Constant.STATUS.YC_NHAP_LAI].includes(evt.status))
            && this.objFunction?.edit,
          function: (evt: any) => {
            this.navigateEdit(evt.employeeName, evt.employeeCode, evt.employeeEvaluationId, evt.employeeId, evt.evaluationPeriodId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.view',
          icon: 'eye',
          isShow: this.objFunction?.view,
          function: (evt: any) => {
            this.navigateEdit(evt.employeeName, evt.employeeCode,
              evt.employeeEvaluationId, evt.employeeId, evt.evaluationPeriodId, true, null, evt.status, evt.isConcurrent);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.adjustRequest',
          icon: 'send',
          isShowFn: (evt: any) => evt.status === Constant.STATUS.PHE_DUYET && this.objFunction.approve,
          function: (evt: any) => {
            this.openModal(evt.employeeEvaluationId);
          }
        }),
        // new ChildActionSchema({
        //   label: 'common.button.export',
        //   icon: 'upload',
        //   isShow: true,
        //   function: (evt: any) => {
        //     this.exportById(evt.employeeEvaluationId);
        //   }
        // }),
        new ChildActionSchema({
          label: 'common.button.send2',
          icon: 'send',
          isShowFn: (evt: any) => evt.status === Constant.STATUS.DU_THAO
            && this.objFunction?.edit,
          function: (evt: any) => {
            this.sendApprove(evt.employeeEvaluationId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.approve',
          icon: 'check',
          isShowFn: (evt: any) => evt.status === Constant.STATUS.CHO_PHE_DUYET
            && this.objFunction.approve && evt.isConcurrent === 'N',
          function: (evt: any) => {
            this.updateApprove('OK', evt.employeeEvaluationId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.approve2',
          icon: 'check',
          isShowFn: (evt: any) => evt.status === Constant.STATUS.CHO_XET_DUYET
            && (
              this.objFunction.review
              || (this.objFunction.approve && evt.isConcurrent === 'Y')
            )
          ,
          function: (evt: any) => {
            this.updateReview('OK', evt.employeeEvaluationId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.rejectApprove',
          icon: 'close',
          isShowFn: (evt: any) => evt.status === Constant.STATUS.CHO_PHE_DUYET
            && this.objFunction.approve && evt.isConcurrent === 'N',
          function: (evt: any) => {
            this.updateApprove('NOT-OK', evt.employeeEvaluationId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.rejectApprove2',
          icon: 'close',
          isShowFn: (evt: any) => evt.status === Constant.STATUS.CHO_XET_DUYET
            && this.objFunction.review,
          function: (evt: any) => {
            this.updateReview('NOT-OK', evt.employeeEvaluationId);
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
    this.employeeEvaluationId = id;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.valueInput = '';
  }

  handleOk(): void {
    this.isSubmitted = true;
    if (this.valueInput.trim()) {
      this.updateStatus(this.employeeEvaluationId, Constant.STATUS.YC_NHAP_LAI, this.valueInput);
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
    ];
  };


  navigateEdit(employeeName?: string, employeeCode?: string, employeeEvaluationId?: number, employeeId?: number, evaluationPeriodId?: number, isDetail = null,
               isAdjust = null, status = null, isConcurrent = null) {
    this.router.navigate(['/kpi/kpi-provides/employee-evaluations/form'],
      {
        queryParams: {
          employeeName,
          employeeCode,
          employeeEvaluationId,
          employeeId,
          evaluationPeriodId,
          isDetail,
          isAdjust,
          status,
          isConcurrent
        }
      });
  }

  updateApprove(type: string, id: NzSafeAny) {
    this.service.createOrImport({ ids: [id] }, REQUEST_TYPE.DEFAULT, UrlConstant.EMPLOYEE_EVALUATION.APPROVE + type).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
    });
  }

  updateReview(type: string, id: NzSafeAny) {
    this.service.createOrImport({ ids: [id] }, REQUEST_TYPE.DEFAULT, UrlConstant.EMPLOYEE_EVALUATION.REVIEW + type).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
    });
  }


  sendApprove(id: NzSafeAny) {
    this.service.update({ id: id }, REQUEST_TYPE.DEFAULT, UrlConstant.EMPLOYEE_EVALUATION.SEND_APPROVE).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
    });
  }


  exportById(id: number) {
    this.service.export(null, UrlConstant.EMPLOYEE_EVALUATION.EXPORT + id).toPromise();
  }

}


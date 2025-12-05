import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SalaryReviewsModel } from '../../../../data-access/models/salary-manager/salary-reviews.model';
import { SalaryReviewsService } from '../../../../data-access/services/salary-manager/salary-reviews.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { UrlConstant as UrlConstantShare } from '@shared/constant/url.class';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BaseResponse } from '@core/models/base-response';
import { SrsFormComponent } from '@app/modules/hrm/pages/salary-manager/salary-reviews/srs-form/srs-form.component';
import { ObjectUtil } from '@core/utils/object.util';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-srs-index',
  templateUrl: './srs-index.component.html',
  styleUrls: ['./srs-index.component.scss']
})
export class SrsIndexComponent extends BaseListComponent<SalaryReviewsModel> implements OnInit {
  serviceName = MICRO_SERVICE.HRM;
  urlLoadData = '/salary-reviews';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  @ViewChild('contentTmpl', { static: true }) content!: TemplateRef<any>;
  @ViewChild('contentFooterTmpl', { static: true }) contentFooter!: TemplateRef<any>;
  @ViewChild('statusTpl', { static: true }) status!: TemplateRef<any>;
  @ViewChild('reviewStatusTpl', { static: true }) reviewStatus!: TemplateRef<any>;
  isShowAdvSearch: boolean;
  salaryReviews = ObjectUtil.optionsToList(Constant.SALARY_REVIEWS, this.translate);
  salaryReviewsDict = ObjectUtil.optionsToDict(Constant.SALARY_REVIEWS);
  salaryStatus = ObjectUtil.optionsToList(Constant.SALARY_REVIEW_STATUS, this.translate);
  salaryStatusDict = ObjectUtil.optionsToDict(Constant.SALARY_REVIEW_STATUS);

  constructor(
    injector: Injector,
    private readonly service: SalaryReviewsService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, null, `/import/${this.formImport.value.periodId}`);
    this.downLoadTemplateApi = () => this.service.downloadFile(`/download-template/${this.formImport.value.periodId}`);
    this.doDownloadFileByNameApi = (url: string) => this.service.downloadFile(url);
    this.approveByListApi = (listId: number[], afterUrl?: string) => this.service.approveByList(listId);
    this.rejectByListApi = (listId: number[], rejectReason: string, afterUrl?: string) => this.service.rejectByList(listId, rejectReason);
    this.approveAllApi = (data: any, afterUrl?: string) => this.service.approveAll(CommonUtils.convertDataSendToServer(data));
    this.serviceName = MICRO_SERVICE.HRM;
    this.functionCode = 'SALARY_REVIEWS';
    this.key = 'salaryReviewId';
    this.formConfig = {
      title: 'hrm.salaryManager.salaryReviews.label.title',
      content: SrsFormComponent
    };
    this.initAction();
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: this.objFunction?.edit || true,
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'common.button.download',
          icon: 'download',
          function: this.doExportById
        })
      ]
    });
  }

  doExportById = (data: SalaryReviewsModel) => {
    this.service.doExportById(data.salaryReviewId).toPromise();
  }

  initFormSearch() {
    this.form = this.fb.group({
      types: [null],
      periodId: [null],
      keySearch: [null],
      status: [null],
      reviewStatus: [null],
    });
    this.initFormImport();
  }

  initFormImport() {
    this.formImport = this.fb.group({
      periodId: [null, [Validators.required]],
      fileExtends: [null],
    });
  }

  afterCloseImport() {
    this.formImport.reset();
  }

  override beforeSearch() {
  }

  override beforeRenderTable() {
    this.responseSearch.data.listData.forEach(el => {
      // el.list = this.list;
    });
  }

  override beforeExport() {
  }

  override setHeaders() {
    this.tableConfig.key = this.key;
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        rowspan: 2,
        width: 50
      },
      {
        title: 'hrm.salaryManager.salaryReviews.label.type',
        field: 'typeName',
        width: 150,
        rowspan: 2,
        thClassList: ['text-center']
      },
      {
        title: 'hrm.salaryManager.salaryReviews.label.periodId',
        field: 'periodName',
        width: 150,
        rowspan: 2,
        thClassList: ['text-center']
      },
      {
        title: 'hrm.salaryManager.salaryReviews.label.employeeCode',
        field: 'employeeCode',
        width: 120,
        rowspan: 2,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'hrm.salaryManager.salaryReviews.label.fullName',
        field: 'fullName',
        width: 150,
        rowspan: 2,
        thClassList: ['text-center']
      },
      {
        title: 'hrm.salaryManager.salaryReviews.label.positionTitle',
        field: 'positionTitle',
        width: 200,
        rowspan: 2,
        thClassList: ['text-center']
      },
      {
        title: 'hrm.salaryManager.salaryReviews.label.organizationId',
        field: 'organizationName',
        width: 200,
        rowspan: 2,
        thClassList: ['text-center']
      },
      {
        title: 'hrm.salaryManager.salaryReviews.label.salaryRankId',
        field: 'salaryRankName',
        width: 150,
        rowspan: 2,
        thClassList: ['text-center']
      },
      {
        title: 'hrm.salaryManager.salaryReviews.label.currentSalary',
        thClassList: ['text-center'],
        colspan: 4,
        child: [
          {
            title: 'hrm.salaryManager.salaryReviews.label.salaryGradeId',
            field: 'salaryGradeName',
            width: 150,
            thClassList: ['text-center']
          },
          {
            title: 'hrm.salaryManager.salaryReviews.label.factorSalaryGrade',
            field: 'factorSalaryGrade',
            width: 120,
            tdClassList: ['text-right'],
            thClassList: ['text-center']
          },
          {
            title: 'hrm.salaryManager.salaryReviews.label.applyDate',
            field: 'applyDate',
            width: 120,
            tdClassList: ['text-center'],
            thClassList: ['text-center']
          },
          {
            title: 'hrm.salaryManager.salaryReviews.label.incrementDate',
            field: 'incrementDate',
            width: 120,
            tdClassList: ['text-center'],
            thClassList: ['text-center']
          }
        ]
      },
      {
        title: 'hrm.salaryManager.salaryReviews.label.proposedApply',
        thClassList: ['text-center'],
        colspan: 3,
        child: [
          {
            title: 'hrm.salaryManager.salaryReviews.label.proposedApplyDate',
            field: 'proposedApplyDate',
            width: 120,
            tdClassList: ['text-center'],
            thClassList: ['text-center']
          },
          {
            title: 'hrm.salaryManager.salaryReviews.label.proposedSalaryGradeId',
            field: 'proposedSalaryGradeName',
            width: 150,
            thClassList: ['text-center']
          },
          {
            title: 'hrm.salaryManager.salaryReviews.label.factorProposedSalaryGrade',
            field: 'factorProposedSalaryGrade',
            width: 120,
            tdClassList: ['text-right'],
            thClassList: ['text-center']
          }
        ]
      },
      {
        title: 'hrm.salaryManager.salaryReviews.label.awardInfos',
        field: 'awardInfos',
        width: 200,
        rowspan: 2,
        thClassList: ['text-center']
      },
      {
        title: 'hrm.salaryManager.salaryReviews.label.punishmentInfos',
        field: 'punishmentInfos',
        width: 200,
        rowspan: 2,
        thClassList: ['text-center']
      },
      {
        title: 'hrm.salaryManager.salaryReviews.label.r0TimekeepingMonths',
        field: 'r0TimekeepingMonths',
        width: 120,
        rowspan: 2,
        tdClassList: ['text-right'],
        thClassList: ['text-center']
      },
      {
        title: 'hrm.salaryManager.salaryReviews.label.reviewStatusId',
        field: 'reviewStatusName',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.reviewStatus,
        width: 200,
        rowspan: 2,
        thClassList: ['text-center']
      },
      {
        title: 'hrm.salaryManager.salaryReviews.label.statusId',
        field: 'statusName',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.status,
        width: 150,
        rowspan: 2,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: ' ',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
        width: 50,
        rowspan: 2,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: window.innerWidth > 1024,
        fixedDir: 'right',
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit,
      }
    ];
  }

  periodId: string;
  isSubmitted2: boolean;
  modalRef2: NzModalRef;

  makeList() {
    this.periodId = null;
    this.isSubmitted2 = false;
    this.modalRef2 = this.modal.create({
      nzWidth: '35%',
      nzTitle: this.translate.instant('hrm.action.synthetic'),
      nzContent: this.content,
      nzFooter: this.contentFooter
    });
  }

  doMakeList() {
    this.isSubmitted2 = true;
    if (!this.periodId) return;
    this.service.makeList({ periodId: this.periodId }).subscribe((res: BaseResponse<any>) => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.modalRef2.destroy();
        this.toast.success(
          this.translate.instant('common.notification.success')
        );
      }
    });
  }
}


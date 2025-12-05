import { Component, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { Constant } from '@app/modules/admin/data-access/constants/constant';
import { CommonUtils } from '@shared/services/common-utils.service';
import { MICRO_SERVICE, STORAGE_NAME } from '@core/constant/system.constants';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { FeedbackModel } from '@app/modules/admin/data-access/models/feedbacks/feedback.model';
import { StorageService } from '@core/services/storage.service';
import { FeedbackService } from '@app/modules/admin/data-access/services/feedbacks/feedback.service';
import { FeedbackFormComponent } from '@app/modules/admin/pages/feedbacks/feedback-form/feedback-form.component';
import { FunctionCode } from '@shared/enums/enums-constant';
import { Mode } from '@shared/constant/common';
import { FeedbackDetailComponent } from '@app/modules/admin/pages/feedbacks/feedback-detail/feedback-detail.component';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';

@Component({
  selector: 'app-feedback-index',
  templateUrl: './feedback-index.component.html',
  styleUrls: ['./feedback-index.component.scss']
})
export class FeedbackIndexComponent extends BaseListComponent<FeedbackModel> implements OnInit {
  subs: Subscription[] = [];
  constant = Constant;
  titleConfig = '';
  isShowAdvSearch = false;
  loginName: string;

  constructor(
    injector: Injector,
    private readonly service: FeedbackService
  ) {
    super(injector);
    this.initFormSearch();
    this.loginName = StorageService.get(STORAGE_NAME.USER_LOGIN)?.loginName;
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.titleConfig = this.translate.instant('admin.feedbacks.processFeedBack');
    this.formConfig = { title: this.titleConfig, content: FeedbackFormComponent };
    this.key = 'feedbackId';
    this.serviceName = MICRO_SERVICE.ADMIN;
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.SYS_FEEDBACKS}`);
    this.initAction();
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.view',
          icon: 'eye',
          isShow: this.objFunction?.view,
          disabled: (evt: any) => {
            return !evt;
          },
          function: this.doOpenFormDetail
        }),
        new ChildActionSchema({
          label: 'admin.feedbacks.process',
          icon: 'edit',
          isShow: this.objFunction?.edit,
          disabled: (evt: any) => {
            return !evt;
          },
          function: this.doOpenFormEdit
        })
      ]
    });
  }

  override doOpenFormDetail = (data: FeedbackModel) => {
    this.titleConfig = this.translate.instant('admin.feedbacks.title');
    this.formConfig = { title: this.titleConfig, content: FeedbackDetailComponent };
    this.doOpenForm(Mode.VIEW, data);
  };

  override doOpenFormEdit = (data: FeedbackModel) => {
    this.titleConfig = this.translate.instant('admin.feedbacks.processFeedBack');
    this.formConfig = { title: this.titleConfig, content: FeedbackFormComponent };
    this.doOpenForm(null, data);
  };

  initFormSearch() {
    this.form = this.fb.group({
      status: null,
      keySearch: null,
      startDate: null,
      endDate: null,
      type:null
    }, {
      validators: [DateValidator.validateTwoDate('startDate', 'endDate', 'greaterAndEqual')]
    });
    this.form.controls.status.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
      setTimeout(() => {
        this.search();
      });
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
        title: 'admin.feedbacks.empCode',
        thClassList: ['text-center'],
        field: 'employeeCode',
        width: 120
      },
      {
        title: 'admin.feedbacks.empName',
        thClassList: ['text-center'],
        field: 'fullName',
        width: 170
      },
      {
        title: 'admin.feedbacks.content',
        thClassList: ['text-center'],
        field: 'content',
        width: 400
      },
      {
        title: 'admin.feedbacks.jobName',
        thClassList: ['text-center'],
        field: 'jobName',
        width: 150
      },
      {
        title: 'admin.feedbacks.orgName',
        thClassList: ['text-center'],
        field: 'orgName',
        width: 250
      },
      {
        title: 'admin.common.createdTime',
        field: 'createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100
      },
      {
        title: 'admin.feedbacks.status',
        field: 'statusName',
        thClassList: ['text-center'],
        width: 120
      },
      {
        title: '',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 60,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
  }


}

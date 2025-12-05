import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { CategoryModel } from '@core/models/category-common.interface';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { Validators } from '@angular/forms';
import { FeedbackService } from '@app/modules/admin/data-access/services/feedbacks/feedback.service';
import { CategoriesService } from '@shared/services/categories.service';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { FeedbackModel } from '@app/modules/admin/data-access/models/feedbacks/feedback.model';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent extends BaseFormComponent<FeedbackModel> implements OnInit {
  listStatus: CategoryModel[] = [];
  feedbackId: number;

  constructor(injector: Injector,
              private readonly feedbackService: FeedbackService,
              private categoryService: CategoriesService
  ) {
    super(injector);
    this.initDataSelect();
    this.updateApi = (body: any) => this.feedbackService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.key = 'feedbackId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.patchValue();
    this.feedbackId = this.data['feedbackId'];
  }

  patchValue() {
    const files = this.data.attachFileList?.map(item => {
      return {
        uid: item.attachmentId,
        name: item.fileName,
        checkSum: item.checkSum,
        status: 'done'
      };
    });
    this.f.files.setValue(files);
  }

  override initForm() {
    this.form = this.fb.group({
      status: [this.data['status'], [Validators.required]],
      type: this.data['type'],
      content: null,
      files: [null]
    });
  }

  initDataSelect() {
    this.subscriptions.push(
      this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.SYS_TRANG_THAI_PHAN_ANH)).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listStatus = res.data?.filter((item: CategoryModel) => item.value !== 'NEW');
        }
      })
    );
  }

  beforeSave() {
    super.beforeSave();
    this.mode = Mode.EDIT;
    this.body['id'] = this.feedbackId;
  }
}

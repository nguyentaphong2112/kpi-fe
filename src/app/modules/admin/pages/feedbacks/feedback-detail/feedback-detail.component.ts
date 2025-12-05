import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { FeedbackService } from '@app/modules/admin/data-access/services/feedbacks/feedback.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { FeedbackModel } from '@app/modules/admin/data-access/models/feedbacks/feedback.model';

@Component({
  selector: 'app-feedback-detail',
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.scss']
})
export class FeedbackDetailComponent extends BaseFormComponent<FeedbackModel> implements OnInit {
  constructor(injector: Injector,
              private readonly feedbackService: FeedbackService,
  ) {
    super(injector);
    this.findOneById = (id) => this.feedbackService.findOneById(id);
    this.updateApi = (body: any) => this.feedbackService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.key = 'feedbackId';
  }

  ngOnInit() {
    super.ngOnInit();
  }

  override initForm() {
    this.form = this.fb.group({
      files: null,
    });
  }

  patchValueInfo() {
    super.patchValueInfo();
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
}

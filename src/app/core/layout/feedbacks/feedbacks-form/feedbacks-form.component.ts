import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { Validators } from '@angular/forms';
import { FeedbacksService } from '@core/layout/feedbacks/service/feedbacks.service';
import { MICRO_SERVICE, STORAGE_NAME } from '@core/constant/system.constants';
import { StorageService } from '@core/services/storage.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-feedbacks-form',
  templateUrl: './feedbacks-form.component.html',
  styleUrls: ['./feedbacks-form.component.scss']
})
export class FeedbacksFormComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  serviceName = MICRO_SERVICE.ADMIN;
  messages = [];
  issue: any = {};

  constructor(injector: Injector,
              private readonly service: FeedbacksService
  ) {
    super(injector);
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: any) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.key = 'feedbackId';
    this.addSuccess = 'Gửi phản ánh thành công';
    this.updateSuccess = 'Gửi nội dung trao đổi thành công';
  }

  ngOnInit() {
    if (this.data) {
      this.issue = JSON.parse(JSON.stringify(this.data));
    }
    this.updateApi = (body: any) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA, `/comments/${this.issue.feedbackId}`);
    super.ngOnInit();
  }

  override afterInitData() {
    this.messages = JSON.parse(JSON.stringify(this.data.comments));
    for (const item of this.messages) {
      item.isMe = item.createdBy === StorageService.get(STORAGE_NAME.USER_LOGIN)?.loginName;
    }
    this.data.content = '';
  }

  override beforeSave() {
    // let functionCode = '';
    // if (this.sessionService.getSessionData(this.router.url)) {
    //   functionCode = this.sessionService.getSessionData(this.router.url).menuCode;
    // } else if (this.sessionService.getSessionData(this.router.url.substring(0, this.router.url.indexOf('?')))) {
    //   functionCode = this.sessionService.getSessionData(this.router.url.substring(0, this.router.url.indexOf('?'))).menuCode;
    // } else if (this.sessionService.getSessionData(this.router.url.substring(0, this.router.url.indexOf('/form')))) {
    //   functionCode = this.sessionService.getSessionData(this.router.url.substring(0, this.router.url.indexOf('/form'))).menuCode;
    // }
    this.body.uri = this.router.url;
  }

  override initForm() {
    this.form = this.fb.group({
      content: [null, [Validators.required, Validators.maxLength(1000)]],
      objectId: [],
      type: null,
      attachments: []
    });
  }

  override afterSave() {
    this.messages.push({
      content: this.body.content,
      isMe: true,
      createdTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    });
    this.isSubmitted = false;
    this.form.controls.content.setValue(null);
    this.form.controls.type.setValue(null);
  }

}

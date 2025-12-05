import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {BaseComponent} from '@core/components/base.component';
import {FeedbacksFormComponent} from '@core/layout/feedbacks/feedbacks-form/feedbacks-form.component';
import {FeedbacksService} from '@core/layout/feedbacks/service/feedbacks.service';
import {BaseResponse} from '@core/models/base-response';
import {HTTP_STATUS_CODE} from '@core/constant/system.constants';
import {Mode} from '@shared/constant/common';

@Component({
  selector: 'app-feedbacks-list',
  templateUrl: './feedbacks-list.component.html',
  styleUrls: ['./feedbacks-list.component.scss']
})
export class FeedbacksListComponent extends BaseComponent implements OnInit {
  modalRef!: NzModalRef;
  @ViewChild('footerTpl') footerTpl!: TemplateRef<any>;
  listFeedback = [];

  constructor(injector: Injector,
              private service: FeedbacksService) {
    super(injector);
  }

  ngOnInit(): void {
    this.getList();
  }

  getList(isNotOpenForm?: boolean) {
    this.service.getList({ startRecord: 0, pageSize: 100 }).subscribe(res => {
      this.listFeedback = res.data.listData;
      if (!isNotOpenForm && this.listFeedback.length === 0) {
        this.openForm();
      }
    });
  }

  openForm() {
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth() > 500 ? 500 : this.getNzWidth(),
      nzTitle: 'Gửi phản ánh',
      nzContent: FeedbacksFormComponent,
      nzMaskClosable: false,
      nzComponentParams: {
        isNotClose: false
      },
      nzClassName: 'feedback-form',
      nzFooter: this.footerTpl
    });
    this.modalRef.afterClose.subscribe((result) => {
        if (result?.refresh) {
          this.getList();
        }
      }
    );
  }

  deleteIssue(issue: any) {
    this.popupService.showModalConfirmDelete(() => {
      this.service.deleteById(issue.feedbackId).subscribe((res: BaseResponse<any>) => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.toast.success(
              this.translate.instant('common.notification.deleteSuccess')
            );
            this.getList(true);
          }
        }
      );
    });
  }

  openFormDetail(data: any) {
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth() > 500 ? 500 : this.getNzWidth(),
      nzTitle: 'Chi tiết phản ánh',
      nzContent: FeedbacksFormComponent,
      nzMaskClosable: false,
      nzComponentParams: {
        data,
        isNotClose: true,
        mode: Mode.EDIT
      },
      nzClassName: 'feedback-form',
      nzFooter: this.footerTpl
    });
  }
}

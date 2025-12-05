import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseComponent} from '@core/components/base.component';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {FeedbacksListComponent} from '@core/layout/feedbacks/feedbacks-list/feedbacks-list.component';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss']
})
export class FeedbacksComponent extends BaseComponent implements OnInit {
  modalRef!: NzModalRef;
  @ViewChild('feedbacksList') feedbacksList!: TemplateRef<any>;
  @ViewChild('footerTpl') footerTpl!: TemplateRef<any>;

  isOpen = false;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

  doOpenListFeedback() {
    if (this.isOpen) {
      this.isOpen = false;
      this.modal.closeAll();
      return;
    } else {
      this.isOpen = true;
    }
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth() > 500 ? 500 : this.getNzWidth(),
      nzTitle: 'Danh sách phản ánh',
      nzContent: FeedbacksListComponent,
      nzMaskClosable: false,
      nzComponentParams: {},
      nzClassName: 'feedback-list',
      nzFooter: this.footerTpl
    });
  }
}

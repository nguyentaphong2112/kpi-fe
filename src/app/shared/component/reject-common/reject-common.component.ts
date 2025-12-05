import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { HTTP_STATUS_CODE } from '../../../core/constant/system.constants';
import { CommonService } from '../../services/common.service';
import { BaseResponse } from '@core/models/base-response';

@Component({
  selector: 'reject-common-template',
  templateUrl: './reject-common.component.html',
  styleUrls: ['./reject-common.component.scss']
})
export class RejectCommonComponent implements OnInit {
  @Input() isReject: boolean = false;
  @Input() listRejectId: number[];
  @Input() rejectId: number;
  @Input() msgSuccess = 'common.notification.isNotApprove';
  @Input() rejectByListApi!: (listId: number[], reason: string, afterUrl?: string) => Observable<BaseResponse<any>>;
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  form: FormGroup;
  isSubmitted: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(private toastService: ToastrService,
              private fb: FormBuilder,
              private translateService: TranslateService) {
    this.form = this.fb.group({
      rejectReason: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
  }

  doClose(refresh: boolean = false) {
    this.isReject = false;
    this.isSubmitted = false;
    this.onCloseModal.emit(refresh);
    this.form.controls['rejectReason'].setValue('');
  }

  doReject() {
    this.isSubmitted = true;
    this.rejectByList();
  }

  rejectByList() {
    if (this.form.valid) {
      const rejectReason = this.form.value['rejectReason'];
      this.subscriptions.push(
        this.rejectByListApi(this.rejectId ? [this.rejectId] : this.listRejectId, rejectReason).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.toastService.success(this.translateService.instant(this.msgSuccess));
            this.doClose(true);
          } else {
            this.toastService.error(res.message);
          }
        }, error => {
          this.toastService.error(error.message);
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach(sub => sub.unsubscribe());
  }
}

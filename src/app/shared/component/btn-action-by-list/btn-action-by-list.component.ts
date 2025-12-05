import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { HTTP_STATUS_CODE } from '../../../core/constant/system.constants';
import { CommonService } from '../../services/common.service';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { BaseResponse } from '@core/models/base-response';

@Component({
  selector: 'btn-action-by-list',
  templateUrl: './btn-action-by-list.component.html',
  styleUrls: ['./btn-action-by-list.component.scss']
})
export class BtnActionByListComponent implements OnInit {
  @Input() isDisabled: boolean;
  @Input() searchFormApprove: FormGroup;
  @Input() approveByListApi!: (listId: number[], afterUrl?: string) => Observable<BaseResponse<any>>;
  @Input() approveAllApi!: (data: any, afterUrl?: string) => Observable<BaseResponse<any>>;
  @Input() serviceName: string;
  @Input() listId: number[] = [];
  @Output() doSearch = new EventEmitter<boolean>();
  @Output() openReject = new EventEmitter<boolean>();
  @Output() resetListId = new EventEmitter<boolean>();
  subscriptions: Subscription[] = [];

  constructor(private commonService: CommonService,
              private toastService: ToastrService,
              private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
  }

  approveAll() {
    this.subscriptions.push(
      this.approveAllApi(this.searchFormApprove.value).subscribe(res => {
        if (res.code == HTTP_STATUS_CODE.OK) {
          this.doSearch.emit(true);
          this.resetListId.emit(false);
          this.toastService.success(this.translateService.instant('common.notification.isApprove'));
        } else {
          this.toastService.error(res.message);
        }
      }, error => {
        this.toastService.error(error.message);
      })
    );
  }

  approveByList() {
    this.subscriptions.push(
      this.approveByListApi(this.listId).subscribe(res => {
        if (res.code == HTTP_STATUS_CODE.OK) {
          this.doSearch.emit(false);
          this.toastService.success(this.translateService.instant('common.notification.isApprove'));
          this.resetListId.emit(false);
        } else {
          this.toastService.error(res.message);
        }
      }, error => {
        this.toastService.error(error.message);
      })
    );
  }

  openRejectByList() {
    this.openReject.emit(true);
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach(sub => sub.unsubscribe());
  }
}

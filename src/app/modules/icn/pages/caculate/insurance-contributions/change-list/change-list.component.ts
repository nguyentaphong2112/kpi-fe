import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {
  InsuranceContributionsService
} from '@app/modules/icn/data-access/services/caculate/insurance-contributions.service';
import { Validators } from '@angular/forms';
import { REQUEST_TYPE } from '@shared/constant/common';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';

@Component({
  selector: 'app-change-list',
  templateUrl: './change-list.component.html',
  styleUrls: ['./change-list.component.scss']
})
export class ChangeListComponent extends BaseFormComponent<NzSafeAny> implements OnInit {

  constructor(
    injector: Injector,
    private readonly service: InsuranceContributionsService
  ) {
    super(injector);
    this.key = 'insuranceContributionId';
  }


  override initForm() {
    this.form = this.fb.group({
      type: [null, [Validators.required]],
      reason: [null]
    });
  }

  override save() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const data = this.form.value;
      this.service.switchType({
        ...data,
        id: data.type,
        ids: [Number(this.data[this.key])]
      }, '/switch-type')
        .subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.toast.success(this.translate.instant('common.notification.updateSuccess'));
            this.modalRef?.close({ refresh: true });
          }
        });
    }
  }
}

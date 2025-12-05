import { Component, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {
  OrganizationEvaluationsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/organization-evaluations.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Validators } from '@angular/forms';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-ert-index',
  templateUrl: './ert-index.component.html',
  styleUrls: ['./ert-index.component.scss']
})
export class ErtIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {

  urlLoadPeriod = UrlConstant.GET_EVALUATION_PERIODS;
  isViewPeriod = false;

  constructor(injector: Injector,
              private readonly service: OrganizationEvaluationsService) {
    super(injector);
    this.initForm();
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true), '/aggregate-export/' + this.form.controls['type'].value);
  }

  ngOnInit() {

  }

  initForm() {
    this.form = this.fb.group({
      type: [null, Validators.required],
      evaluationPeriodId: [null]
    });
    this.form.controls['type'].valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.isViewPeriod = value == 'SCHOOL_INVALID';
      this.form.controls['evaluationPeriodId'].setValue(null);
      this.form.controls['evaluationPeriodId'].setValidators(value == 'SCHOOL_INVALID' ? Validators.required : null);
      this.form.controls['evaluationPeriodId'].setErrors(null);
      this.form.controls['evaluationPeriodId'].updateValueAndValidity({ emitEvent: false });
    });
  }


}

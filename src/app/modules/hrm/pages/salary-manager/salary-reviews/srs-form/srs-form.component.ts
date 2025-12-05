import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { SalaryReviewsModel } from '../../../../data-access/models/salary-manager/salary-reviews.model';
import { SalaryReviewsService } from '../../../../data-access/services/salary-manager/salary-reviews.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { ObjectUtil } from '@core/utils/object.util';

@Component({
  selector: 'srs-form',
  templateUrl: './srs-form.component.html',
  styleUrls: ['./srs-form.component.scss']
})
export class SrsFormComponent extends BaseFormComponent<SalaryReviewsModel> implements OnInit {

  salaryReviews = ObjectUtil.optionsToList(Constant.SALARY_REVIEWS, this.translate);
  serviceName = MICRO_SERVICE.HRM;
  urlLoadData = '/salary-reviews';
  constructor(
    private readonly service: SalaryReviewsService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'salaryReviewId';

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: SalaryReviewsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: SalaryReviewsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      salaryReviewId: [null],
      employeeCode: [null],
      fullName: [null],
      r0TimekeepingMonths: [null],
      proposedApplyDate: [null, [Validators.required]],
      reviewStatusId: [null, [Validators.required]],
      note: [null, [Validators.maxLength(500)]],
    });
  }
}



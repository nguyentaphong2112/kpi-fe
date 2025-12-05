import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { SalaryReviewsModel } from '../../models/salary-manager/salary-reviews.model';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';

@Injectable({
  providedIn: 'root'
})
export class SalaryReviewsService extends BaseCrudService<SalaryReviewsModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.SALARY_REVIEWS.PREFIX;

  makeList(data: any) {
    this.resetRequest();
    this.requestOptions.data = data;
    this.requestOptions.serviceName = this.serviceName;
    const urlEndpoint = UrlConstant.API_VERSION + UrlConstant.SALARY_REVIEWS.MAKE_LIST;
    return this.post(urlEndpoint, this.requestOptions);
  }

  doExportById(salaryReviewId: number) {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const urlEndpoint = UrlConstant.API_VERSION + UrlConstant.SALARY_REVIEWS.EXPORT + `/${salaryReviewId}`;
    return this.getRequestFile(urlEndpoint, this.requestOptions);
  }
}



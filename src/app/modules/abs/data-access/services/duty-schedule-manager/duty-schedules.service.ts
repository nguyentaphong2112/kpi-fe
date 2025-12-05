import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { DutySchedulesModel } from '../../models/duty-schedule-manager/duty-schedules.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {HttpParams} from "@angular/common/http";
import {UrlConstant} from "@app/modules/abs/data-access/constant/url.class";

@Injectable({
  providedIn: 'root'
})
export class DutySchedulesService extends BaseCrudService<DutySchedulesModel> {
  protected override serviceName = MICRO_SERVICE.ABS;
  protected override urlEndpoint = '/v1/duty-schedules';

  exportTotal(params: HttpParams,responseType?: string) {
    this.resetRequest();
    const url = `${this.urlEndpoint}/export-total`
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.responseType = responseType ?? 'blob';
    this.requestOptions.params = params;
    return this.get(url, this.requestOptions);
  }
}



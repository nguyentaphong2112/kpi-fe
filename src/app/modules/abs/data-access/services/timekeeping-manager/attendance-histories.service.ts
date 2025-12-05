import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { AttendanceHistoriesModel } from '../../models/timekeeping-manager/attendance-histories.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant} from "@app/modules/hrm/data-access/constant/url.class";

@Injectable({
  providedIn: 'root'
})
export class AttendanceHistoriesService extends BaseCrudService<AttendanceHistoriesModel> {
  protected override serviceName = MICRO_SERVICE.ABS;
  protected override urlEndpoint = '/v1/attendance-histories';

  getLogData(params: any) {
    this.resetRequest();
    this.requestOptions.params = params;
    this.requestOptions.serviceName = this.serviceName;
    const urlEndpoint = UrlConstant.API_VERSION + '/attendance-histories/get-log';
    return this.get(urlEndpoint, this.requestOptions);
  }
}



import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { ConfigChartsModel } from '../../models/configurations/config-charts.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {Observable} from "rxjs";
import {BaseResponse} from "@core/models/base-response";
import {UrlConstant} from "@shared/constant/url.class";

@Injectable({
  providedIn: 'root'
})
export class ConfigChartsService extends BaseCrudService<ConfigChartsModel> {
  protected override serviceName = MICRO_SERVICE.ADMIN;
  protected override urlEndpoint = '/v1/config-charts';

  public getChartData(id: any, urlAfter: string, serviceName: string, chartUrl?:string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    this.requestOptions.cacheGetRequest = false;

    let url = chartUrl
      ? `/${chartUrl}${urlAfter || ''}`
      : `/v1/chart${urlAfter || ''}/${id}`;

    return this.get(url, this.requestOptions);
  }
}



import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '@core/services/base/base.service';
import { BaseResponse } from '@core/models/base-response';
import { UrlConstant } from '@shared/constant/url.class';
import { MICRO_SERVICE } from '@core/constant/system.constants';

@Injectable({
  providedIn: 'root'
})
export class DataService extends BaseService {
  public getData(endpoint: string, serviceName: string, cacheGetRequest?: boolean, searchParam?: any, durationCache?: number) {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    this.requestOptions.params = searchParam;
    this.requestOptions.cacheGetRequest = cacheGetRequest;
    this.requestOptions.ttl = durationCache ? durationCache : 60;
    this.requestOptions.hideLoading = true;
    const url = (serviceName ? UrlConstant.API_VERSION + endpoint : endpoint);
    return this.get(url, this.requestOptions);
  }

  public getDataLoadMore(endpoint: string, searchParam: any, serviceName: string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    this.requestOptions.params = searchParam;
    this.requestOptions.cacheGetRequest = true;
    this.requestOptions.hideLoading = true;
    this.requestOptions.ttl = 60;
    const url = (serviceName ? UrlConstant.API_VERSION : '') + endpoint;
    return this.get(url, this.requestOptions);
  }

  getDataByParam(endpoint: string, searchParam: any, serviceName: string, cacheGetRequest?: boolean, durationCache?: number, hideLoading?: boolean) {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    this.requestOptions.params = searchParam;
    this.requestOptions.cacheGetRequest = cacheGetRequest;
    this.requestOptions.hideLoading = hideLoading;
    this.requestOptions.ttl = durationCache ? durationCache : 60;
    const url = (serviceName ? UrlConstant.API_VERSION : '') + endpoint;
    return this.get(url, this.requestOptions);
  }

  getAttributeConfig(params: any) {
    this.resetRequest();
    this.requestOptions.serviceName = MICRO_SERVICE.ADMIN;
    this.requestOptions.params = params;
    const url = UrlConstant.API_VERSION + UrlConstant.GET_ATTRIBUTE_CONFIG;
    return this.get(url, this.requestOptions);
  }
}

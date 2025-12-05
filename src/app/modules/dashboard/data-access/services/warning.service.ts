import { Injectable } from '@angular/core';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { UrlConstant } from '../constant/url.class';
import { Observable } from 'rxjs';
import { BaseResponse } from '@core/models/base-response';

@Injectable({
  providedIn: 'root'
})
export class WarningService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.ADMIN;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.WARNING.PREFIX;

  public getCount(id: any, urlAfter: string, serviceName: string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    this.requestOptions.cacheGetRequest = false;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '') + '/{id}'.replace('{id}', id);
    return this.get(url, this.requestOptions);
  }

  public exportWarning(searchParam: any, serviceName: string, urlAfter?: string, isPost?: boolean, paramPost?: any, responseType?: string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    this.requestOptions.responseType = responseType ?? 'blob';
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '/export');
    if (isPost) {
      this.requestOptions.data = searchParam;
      this.requestOptions.params = paramPost;
      return this.postRequestFile(url, this.requestOptions);
    } else {
      this.requestOptions.params = searchParam;
      return this.getRequestFile(url, this.requestOptions);
    }
  }

}

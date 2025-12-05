import { Injectable } from '@angular/core';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {Observable} from "rxjs";
import {BaseResponse} from "@core/models/base-response";

@Injectable({
  providedIn: 'root'
})
export class DynamicReportService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.ADMIN;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.DYNAMIC_REPORTS.PREFIX;

  public exportByReportCode(searchParam: any,reportCode:string, urlAfter?: string, isPost?: boolean, paramPost?: any, responseType?: string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.responseType = responseType ?? 'blob';
    const url = this.urlEndpoint + '/export' + `/${reportCode}`;
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

import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { TimekeepingsModel } from '../../models/timekeeping-manager/timekeepings.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant} from "@app/modules/abs/data-access/constant/url.class";
import {HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {BaseResponse} from "@core/models/base-response";

@Injectable({
  providedIn: 'root'
})
export class TimekeepingsService extends BaseCrudService<TimekeepingsModel> {
  protected override serviceName = MICRO_SERVICE.ABS;
  protected override urlEndpoint = '/v1/time-keeping/THUONG';


  timekeepingAuto(data: any) {
    this.resetRequest();
    const url = `${UrlConstant.API_VERSION}${UrlConstant.SEARCH_FORM.TIMEKEEPING_AUTO}/THUONG`
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.data = data;
    return this.post(url, this.requestOptions);
  }

  override export(searchParam: any, urlAfter?: string, isPost?: boolean, paramPost?: any, responseType?: string): Observable<BaseResponse<any>> {
    this.urlEndpoint = '/v1/time-keeping';
    urlAfter = '/export/THUONG'
    return super.export(searchParam, urlAfter, isPost, paramPost, responseType);
  }

  public searchTimeKeeping(searchParam: HttpParams, pagination: { startRecord: number, pageSize: number }) {
    this.resetRequest();
    if (pagination) searchParam = searchParam.appendAll(pagination);
    const url = this.urlEndpoint;
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = searchParam;
    return this.get(url, this.requestOptions);
  }

}



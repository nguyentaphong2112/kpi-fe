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
export class WarningConfigsService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.ADMIN;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.WARNING_CONFIGS.PREFIX;

  public searchPopup(searchParam: any, pagination: {
    startRecord: number,
    pageSize: number
  }, urlAfter: string, serviceName: string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    this.requestOptions.params = { ...searchParam, ...pagination };
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '');
    return this.get(url, this.requestOptions);
  }
}

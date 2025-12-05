import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import { Observable } from 'rxjs';
import { BaseResponse } from '@core/models/base-response';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.ADMIN;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.USERS.GET_USER;


  public resetPass(id: string, params: NzSafeAny, urlAfter?: string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '') + `/${id}`;
    this.requestOptions.params = params;
    return this.put(url, this.requestOptions);
  }
}

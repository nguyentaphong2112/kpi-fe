import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import { BaseResponse } from '@core/models/base-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.ADMIN;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.USER_ROLES.GET_USER_ROLE;

  deleteRole(url: string): Observable<BaseResponse<NzSafeAny>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    return this.delete(url, this.requestOptions);
  }
}

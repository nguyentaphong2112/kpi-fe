import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BaseService } from '@core/services/base/base.service';
import { BaseResponse } from '@core/models/base-response';
import { MICRO_SERVICE } from '@core/constant/system.constants';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  public getMyMenu(): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = MICRO_SERVICE.ADMIN;
    this.requestOptions.hideLoading = true;
    return this.get('/v1/user/menu', this.requestOptions);
  }

  public getMyMenuTree(): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = MICRO_SERVICE.ADMIN;
    return this.get('/v1/user/menu-tree', this.requestOptions);
  }
}

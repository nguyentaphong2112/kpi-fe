import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '@core/services/base/base.service';
import { UrlConstant } from '@shared/constant/url.class';
import { CurrentPage } from '@core/models/current-page.interface';
import { BaseResponse } from '@core/models/base-response';
import { MICRO_SERVICE } from '@app/core/constant/system.constants';

@Injectable({
  providedIn: 'root'
})
export class StaffInfoService extends BaseService {
  public getEmployeeData(param: CurrentPage): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.params = {...param};
    this.requestOptions.serviceName = MICRO_SERVICE.HRM;
    const url = UrlConstant.API_VERSION + UrlConstant.EMPLOYEES.PREFIX + UrlConstant.EMPLOYEES.DATA_PICKER;
    return this.get(url, this.requestOptions);
  }
  public getCatalog(typeCode: string, parentCode?: number) {
    this.resetRequest();

    const params: any = { typeCode };
    if (parentCode !== undefined) {
      params.parentCode = parentCode;
    }

    this.requestOptions.params = params;
    this.requestOptions.serviceName = MICRO_SERVICE.HRM;
    const url = UrlConstant.API_VERSION + UrlConstant.CATALOGS.PREFIX;
    return this.get(url, this.requestOptions);
  }

}

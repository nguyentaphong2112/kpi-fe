import { Injectable } from '@angular/core';
import { UrlConstant } from '@shared/constant/url.class';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Injectable({
  providedIn: 'root' // just before your class
})
export class PersonalInfoService extends BaseCrudService<NzSafeAny> {
  readonly serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.EMPLOYEES.PREFIX;

  public getById(employeeId: number) {
    this.resetRequest();
    const url = UrlConstant.API_VERSION + (employeeId ? (UrlConstant.EMPLOYEES.PREFIX + '/' + employeeId) : (UrlConstant.EMPLOYEES.PREFIX + UrlConstant.EMPLOYEES.PERSONAL));
    this.requestOptions.serviceName = this.serviceName;
    return this.get(url, this.requestOptions);
  }

}

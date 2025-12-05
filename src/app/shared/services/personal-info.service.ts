import { Injectable } from '@angular/core';
import { UrlConstant } from '../constant/url.class';
import { BaseService } from '@core/services/base/base.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';

@Injectable({
  providedIn: 'root'
})
export class PersonalInfoService extends BaseService {
  readonly serviceName = MICRO_SERVICE.HRM;

  public getAvatar(employeeId?: number) {
    this.resetRequest();
    const url = UrlConstant.API_VERSION + UrlConstant.EMPLOYEES.PREFIX +
      (employeeId ? (UrlConstant.EMPLOYEES.AVATAR + '/' + employeeId) : (UrlConstant.EMPLOYEES.AVATAR + UrlConstant.EMPLOYEES.PERSONAL));
    this.requestOptions.serviceName = this.serviceName;
    return this.get(url, this.requestOptions);
  }

  public getBasicInfo(employeeId?: number) {
    this.resetRequest();
    const url = UrlConstant.API_VERSION + UrlConstant.EMPLOYEES.PREFIX + UrlConstant.EMPLOYEES.BASIC_INFO + UrlConstant.EMPLOYEES.PERSONAL;
    this.requestOptions.serviceName = this.serviceName;
    return this.get(url, this.requestOptions);
  }

  public uploadAvatar(employeeId: number | any, formData: any) {
    this.resetRequest();
    const url = UrlConstant.API_VERSION + UrlConstant.EMPLOYEES.PREFIX +
      (employeeId ? (UrlConstant.EMPLOYEES.AVATAR + '/' + employeeId) : (UrlConstant.EMPLOYEES.AVATAR + UrlConstant.EMPLOYEES.PERSONAL));
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.data = formData;
    return this.post(url, this.requestOptions);
  }

  public deleteAvatar(employeeId: number | any, formData: any) {
    this.resetRequest();
    const url = UrlConstant.API_VERSION + UrlConstant.EMPLOYEES.PREFIX +
      (employeeId ? (UrlConstant.EMPLOYEES.AVATAR + '/' + employeeId) : (UrlConstant.EMPLOYEES.AVATAR + UrlConstant.EMPLOYEES.PERSONAL));
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.data = formData;
    return this.delete(url, this.requestOptions);
  }
}

import {Injectable} from '@angular/core';
import {UrlConstant} from '@app/modules/hrm/data-access/constant/url.class';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import {BaseCrudService} from '@core/services/base/base-crud.service';
import {NzSafeAny} from 'ng-zorro-antd/core/types';

@Injectable({
  providedIn: 'root'
})
export class IdentityInfoService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.PERSONAL_IDENTITIES.PREFIX;

  public getIdentityInfo(employeeId: number, param: any) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.PERSONAL_IDENTITIES.LIST.replace('/{employeeId}', employeeId ? ('/' + employeeId.toString()) : UrlConstant.EMPLOYEES.PERSONAL);
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = param;
    return this.get(url, this.requestOptions);
  }

}

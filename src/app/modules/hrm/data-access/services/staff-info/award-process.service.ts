import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';

@Injectable({
  providedIn: 'root'
})
export class AwardProcessService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.AWARD_PROCESS.PREFIX;

  public getAwardProcess(employeeId: number, param: any) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.AWARD_PROCESS.LIST.replace('/{employeeId}', employeeId ? ('/' + employeeId.toString()) : UrlConstant.EMPLOYEES.PERSONAL);
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = param;
    return this.get(url, this.requestOptions);
  }
}

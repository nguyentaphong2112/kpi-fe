import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseResponse} from '@shared/data-access/base-response';
import {UrlConstant} from '@app/modules/hrm/data-access/constant/url.class';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import {BaseCrudService} from '@core/services/base/base-crud.service';
import {NzSafeAny} from 'ng-zorro-antd/core/types';

@Injectable({
  providedIn: 'root'
})
export class WorkBeforeHisService extends BaseCrudService<NzSafeAny> {
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.WORK_BEFORE_HISTORY.PREFIX;
  protected override serviceName = MICRO_SERVICE.HRM;

  public getTableList(employeeId: number | any, param: any): Observable<BaseResponse> {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.WORK_BEFORE_HISTORY.PAGE.replace('/{employeeId}', employeeId ? ('/' + employeeId.toString()) : UrlConstant.EMPLOYEES.PERSONAL);
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = param;
    return this.get(url, this.requestOptions);
  }

}

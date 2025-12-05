import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {NzSafeAny} from 'ng-zorro-antd/core/types';
import {UrlConstant} from '@app/modules/hrm/data-access/constant/url.class';
import {BaseResponse} from '@shared/data-access/base-response';
import {BaseService} from '@core/services/base/base.service';
import {MICRO_SERVICE} from '@core/constant/system.constants';

@Injectable({
  providedIn: 'root'
})
export class ContractHisInfoService extends BaseService {
  readonly baseUrl = UrlConstant.API_VERSION + UrlConstant.CONTRACT_HISTORY_INFO.PREFIX;
  readonly serviceName = MICRO_SERVICE.HRM;

  // Lấy danh sách
  public getList(employeeId: number | NzSafeAny, param: any): Observable<BaseResponse> {
    const url = this.baseUrl + UrlConstant.CONTRACT_HISTORY_INFO.LIST.replace('/{employeeId}', employeeId ? ('/' + employeeId.toString()) : UrlConstant.EMPLOYEES.PERSONAL);
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = param;
    return this.get(url, this.requestOptions);
  }
}

import {Injectable} from '@angular/core';
import {BaseCrudService} from '@core/services/base/base-crud.service';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {AllowanceProcessModel} from '../../models/research/allowance-process.model';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { Observable } from 'rxjs';
import { BaseResponse } from '@shared/data-access';

@Injectable({
  providedIn: 'root'
})
export class AllowanceProcessService extends BaseCrudService<AllowanceProcessModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.ALLOWANCE_PROCESS.PREFIX;

  public getTableList(employeeId: number, param: any): Observable<BaseResponse> {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.ALLOWANCE_PROCESS.LIST.replace('/{employeeId}', employeeId ? ('/' + employeeId.toString()) : UrlConstant.EMPLOYEES.PERSONAL);
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = param;
    return this.get(url, this.requestOptions);
  }
}



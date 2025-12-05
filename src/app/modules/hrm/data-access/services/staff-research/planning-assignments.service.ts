import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { Observable } from 'rxjs';
import { BaseResponse } from '@shared/data-access';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';

@Injectable({
  providedIn: 'root'
})
export class PlanningAssignmentsService extends BaseCrudService<NzSafeAny>{
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = '/v1/planning-assignments';

  public getTableList(employeeId: number, param: any): Observable<BaseResponse> {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.PLANNING_ASSIGNMENT.LIST.replace('/{employeeId}', employeeId ? ('/' + employeeId.toString()) : UrlConstant.EMPLOYEES.PERSONAL);
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = param;
    return this.get(url, this.requestOptions);
  }
}

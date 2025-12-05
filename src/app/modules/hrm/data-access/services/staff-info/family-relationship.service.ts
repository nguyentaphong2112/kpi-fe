import { Injectable } from '@angular/core';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { Observable } from 'rxjs';
import { BaseResponse } from '@shared/data-access';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Injectable({
  providedIn: 'root'
})
export class FamilyRelationshipService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.FAMILY_RELATIONSHIP.PREFIX;


  public getTabeList(employeeId: number | any, param: any): Observable<BaseResponse> {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.FAMILY_RELATIONSHIP.PAGE.replace('/{employeeId}', employeeId ? ('/' + employeeId.toString()) : UrlConstant.EMPLOYEES.PERSONAL);
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = param;
    return this.get(url, this.requestOptions);
  }

}

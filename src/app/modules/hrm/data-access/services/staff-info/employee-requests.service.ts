import { Injectable } from '@angular/core';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRequestsService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.EMPLOYEE_REQUESTS.PREFIX;
}

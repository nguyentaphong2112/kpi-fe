import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Injectable({
  providedIn: 'root'
})
export class EmployeeWorkPlanningsService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.KPI;
  protected override urlEndpoint = '/v1/employee-work-plannings';
}

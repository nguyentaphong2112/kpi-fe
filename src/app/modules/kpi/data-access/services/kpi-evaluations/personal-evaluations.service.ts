import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { EmployeeEvaluationsModel } from '../../models/kpi-evaluations/employee-evaluations.model';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalEvaluationsService extends BaseCrudService<EmployeeEvaluationsModel> {
  protected override serviceName = MICRO_SERVICE.KPI;
  protected override urlEndpoint = '/v1/personal-evaluations';
}



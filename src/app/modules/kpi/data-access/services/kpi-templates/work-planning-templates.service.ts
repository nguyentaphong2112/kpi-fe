import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { WorkPlanningTemplatesModel } from '../../models/kpi-templates/work-planning-templates.model';
import {MICRO_SERVICE} from '@core/constant/system.constants';

@Injectable({
  providedIn: 'root'
})
export class WorkPlanningTemplatesService extends BaseCrudService<WorkPlanningTemplatesModel> {
  protected override serviceName = MICRO_SERVICE.KPI;
  protected override urlEndpoint = '/v1/work-planning-templates';
}



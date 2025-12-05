import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { WorkProcessModel } from '../../models/research/work-process.model';

@Injectable({
  providedIn: 'root'
})
export class WorkProcessCustomService extends BaseCrudService<WorkProcessModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = '/v2/work-process';
}



import { Injectable } from '@angular/core';
import { MICRO_SERVICE } from '@app/core/constant/system.constants';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { PositionSalaryProcessModel } from '../../models/research/position-salary-process.model';

@Injectable({
  providedIn: 'root'
})
export class PositionSalaryProcessService extends BaseCrudService<PositionSalaryProcessModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = '/v1/position-salary-process';
}



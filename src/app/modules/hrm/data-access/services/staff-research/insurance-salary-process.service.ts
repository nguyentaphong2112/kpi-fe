import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { InsuranceSalaryProcessModel } from '../../models/research/insurance-salary-process.model';

@Injectable({
  providedIn: 'root'
})
export class InsuranceSalaryProcessService extends BaseCrudService<InsuranceSalaryProcessModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = '/v1/insurance-salary-process';
}



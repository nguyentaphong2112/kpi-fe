import { Injectable } from '@angular/core';
import { MICRO_SERVICE } from '@app/core/constant/system.constants';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { EmployeesModel } from '../../models/research/employees.model';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService extends BaseCrudService<EmployeesModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint =  UrlConstant.API_VERSION + UrlConstant.EMPLOYEES.PREFIX;
}



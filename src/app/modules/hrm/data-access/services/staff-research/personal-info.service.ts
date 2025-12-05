import {Injectable} from '@angular/core';
import {BaseCrudService} from '@core/services/base/base-crud.service';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {EmployeesModel} from '../../models/research/employees.model';

@Injectable({
  providedIn: 'root'
})
export class PersonalInfoService extends BaseCrudService<EmployeesModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = '/v1/employees/basic-information';
}



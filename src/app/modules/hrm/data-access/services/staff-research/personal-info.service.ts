import {Injectable} from '@angular/core';
import {BaseCrudService} from '@core/services/base/base-crud.service';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class PersonalInfoService extends BaseCrudService<any> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = '/v1/employees/basic-information';
}



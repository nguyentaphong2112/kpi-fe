import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { EmployeesModel } from '../../models/hrm-managers/employees.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant} from "@shared/constant/url.class";

@Injectable({
  providedIn: 'root'
})
export class EmployeesService extends BaseCrudService<EmployeesModel> {
  protected override serviceName = MICRO_SERVICE.CRM;
  protected override urlEndpoint = '/v1/employees';

  public getListEmployee(keySearch?: string) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.EMPLOYEES.LIST +
      '?keySearch=' + encodeURIComponent(keySearch || '');
    this.requestOptions.serviceName = this.serviceName;
    return this.get(url, this.requestOptions);
  }

}



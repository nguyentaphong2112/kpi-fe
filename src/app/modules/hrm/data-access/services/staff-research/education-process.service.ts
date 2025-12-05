import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { EducationProcessModel } from '../../models/research/education-process.model';
import { UrlConstant } from '../../constant/url.class';

@Injectable({
  providedIn: 'root'
})
export class EducationProcessService extends BaseCrudService<EducationProcessModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = '/v1/education-process';

  public getEducationProcess(employeeId: number, param: any) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.EDU_PROCESS.LIST.replace('/{employeeId}', employeeId ? ('/' + employeeId.toString()) : UrlConstant.EMPLOYEES.PERSONAL);
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = param;
    return this.get(url, this.requestOptions);
  }
}



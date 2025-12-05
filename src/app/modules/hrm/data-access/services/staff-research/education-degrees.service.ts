import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { EducationDegreesModel } from '../../models/research/education-degrees.model';
import { UrlConstant } from '../../constant/url.class';

@Injectable({
  providedIn: 'root'
})
export class EducationDegreesService extends BaseCrudService<EducationDegreesModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = '/v1/education-degrees';

  public getEducationDegrees(employeeId: number, param: any) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.EDU_DEGREES.LIST.replace('/{employeeId}', employeeId ? ('/' + employeeId.toString()) : UrlConstant.EMPLOYEES.PERSONAL);
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = param;
    return this.get(url, this.requestOptions);
  }


  public suggestDataListByType(type: string){
    this.resetRequest();
    const url = `${this.urlEndpoint}/${type}`;
    this.requestOptions.serviceName = this.serviceName;
    return this.get(url, this.requestOptions);
  }
}



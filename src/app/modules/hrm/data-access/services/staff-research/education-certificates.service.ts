import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { EducationCertificatesModel } from '../../models/research/education-certificates.model';
import { UrlConstant } from '../../constant/url.class';

@Injectable({
  providedIn: 'root'
})
export class EducationCertificatesService extends BaseCrudService<EducationCertificatesModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = '/v1/education-certificates';

  public getEducationCertificates(employeeId: number, param: any) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.EDU_CERTIFICATES.LIST.replace('/{employeeId}', employeeId ? ('/' + employeeId.toString()) : UrlConstant.EMPLOYEES.PERSONAL);
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = param;
    return this.get(url, this.requestOptions);
  }
}



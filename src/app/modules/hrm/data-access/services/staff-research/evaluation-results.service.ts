import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';

@Injectable({
  providedIn: 'root'
})
export class EvaluationResultsService extends BaseCrudService<any> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.EVALUATION_RESULTS.PREFIX;

  public getEvaluationResult(employeeId: number, param: any) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.EVALUATION_RESULTS.LIST.replace('/{employeeId}', employeeId ? ('/' + employeeId.toString()) : UrlConstant.EMPLOYEES.PERSONAL);
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = param;
    return this.get(url, this.requestOptions);
  }
}



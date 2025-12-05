import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { EmployeeEvaluationsModel } from '../../models/kpi-evaluations/employee-evaluations.model';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeEvaluationsService extends BaseCrudService<EmployeeEvaluationsModel> {
  protected override serviceName = MICRO_SERVICE.KPI;
  protected override urlEndpoint = '/v1/employee-evaluations';

  exportEmpSummary(searchParams: any) {
    this.resetRequest();
    this.requestOptions.params = searchParams;
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.responseType = 'blob';
    const urlEndpoint = '/v1/employee-evaluations/export-emp-summary';
    return this.get(urlEndpoint, this.requestOptions);
  }

  confirmResult(data?: any) {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    if (data) {
      this.requestOptions.data = data;
    }
    const url = this.urlEndpoint + '/confirm-result';
    return this.put(url, this.requestOptions);
  }

  finalResult(data?: any) {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    if (data) {
      this.requestOptions.data = data;
    }
    const url = this.urlEndpoint + '/final-result';
    return this.put(url, this.requestOptions);
  }
}



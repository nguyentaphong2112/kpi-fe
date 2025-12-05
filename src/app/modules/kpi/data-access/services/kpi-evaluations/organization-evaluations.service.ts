import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { OrganizationEvaluationsModel } from '../../models/kpi-evaluations/organization-evaluations.model';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationEvaluationsService extends BaseCrudService<OrganizationEvaluationsModel> {
  protected override serviceName = MICRO_SERVICE.KPI;
  protected override urlEndpoint = '/v1/organization-evaluations';

  exportOrgSummary(searchParams: any) {
    this.resetRequest();
    this.requestOptions.params = searchParams;
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.responseType = 'blob';
    const urlEndpoint = '/v1/organization-evaluations/export-org-summary';
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



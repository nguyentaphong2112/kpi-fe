import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';

@Injectable({
  providedIn: 'root'
})
export class OrgService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.ORGANIZATIONS.PREFIX;

  getListOrgHierarchy(orgId: number) {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + UrlConstant.ORGANIZATIONS.GET_HIERARCHY.replace("{id}", orgId?.toString());
    return this.get(url, this.requestOptions)
  }

  getReportLaborStructure(params: any) {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = params;
    const url = this.urlEndpoint + UrlConstant.ORGANIZATIONS.GET_REPORT_LABOR_STRUCTURE;
    return this.get(url, this.requestOptions)
  }
}

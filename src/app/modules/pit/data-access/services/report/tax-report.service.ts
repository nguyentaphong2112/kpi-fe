import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { TaxSettlementMastersModel } from '../../models/settlement/tax-settlement-masters.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant} from "@app/modules/pit/data-access/constant/url.class";

@Injectable({
  providedIn: 'root'
})
export class TaxReportService extends BaseCrudService<TaxSettlementMastersModel> {
  protected override serviceName = MICRO_SERVICE.PIT;
  protected override urlEndpoint = '/v1/tax-reports';

  exportDetail(params: any ) {
    const reportType = params.reportType;
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.TAX_REPORT.DETAIL + reportType;
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = params;
    return this.getRequestFile(url,this.requestOptions);
  }

}



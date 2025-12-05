import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { TaxSettlementMastersModel } from '../../models/settlement/tax-settlement-masters.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant} from "@app/modules/pit/data-access/constant/url.class";

@Injectable({
  providedIn: 'root'
})
export class TaxSettlementMastersService extends BaseCrudService<TaxSettlementMastersModel> {
  protected override serviceName = MICRO_SERVICE.PIT;
  protected override urlEndpoint = '/v1/tax-settlement-masters';

  exportDetail(id: number | any) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.TAX_SETTLEMENT_MASTERS.EXPORT_DETAIL.replace('{id}', id.toString())
    this.requestOptions.serviceName = this.serviceName;
    return this.getRequestFile(url,this.requestOptions);
  }

  exportGroup(id: number | any) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.TAX_SETTLEMENT_MASTERS.EXPORT_GROUP.replace('{id}', id.toString())
    this.requestOptions.serviceName = this.serviceName;
    return this.getRequestFile(url,this.requestOptions);
  }

  exportMonth(id: number | any) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.TAX_SETTLEMENT_MASTERS.EXPORT_MONTH.replace('{id}', id.toString())
    this.requestOptions.serviceName = this.serviceName;
    return this.getRequestFile(url,this.requestOptions);
  }

}



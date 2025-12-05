import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { TaxDeclareMastersModel } from '../../models/declare/tax-declare-masters.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant} from "@app/modules/pit/data-access/constant/url.class";

@Injectable({
  providedIn: 'root'
})
export class TaxDeclareMastersService extends BaseCrudService<TaxDeclareMastersModel> {
  protected override serviceName = MICRO_SERVICE.PIT;
  protected override urlEndpoint = '/v1/tax-declare-masters';

  exportDetail(id: number | any) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.TAX_DECLARE_MASTERS.EXPORT_DETAIL.replace('{id}', id.toString())
    this.requestOptions.serviceName = this.serviceName;
    return this.getRequestFile(url,this.requestOptions);
  }

  exportXML(id: number | any) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.TAX_DECLARE_MASTERS.EXPORT_XML.replace('{id}', id.toString())
    this.requestOptions.serviceName = this.serviceName;
    return this.getRequestFile(url,this.requestOptions);
  }

  exportTaxAllocation(id: number | any) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.TAX_DECLARE_MASTERS.EXPORT_TAX_ALLOCATION.replace('{id}', id.toString())
    this.requestOptions.serviceName = this.serviceName;
    return this.getRequestFile(url,this.requestOptions);
  }

  calculator(data: any) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.TAX_DECLARE_MASTERS.CALCULATE;
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = data;
    return this.post(url, this.requestOptions);
  }
}



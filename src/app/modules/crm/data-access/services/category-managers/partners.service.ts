import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { PartnersModel } from '../../models/category-managers/partners.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant} from "@shared/constant/url.class";
import {PrintCardModel} from "@app/modules/admin/data-access/models/card-templates/print-card.model";
import {CommonUtils} from "@shared/services/common-utils.service";

@Injectable({
  providedIn: 'root'
})
export class PartnersService extends BaseCrudService<PartnersModel> {
  protected override serviceName = MICRO_SERVICE.CRM;
  protected override urlEndpoint = '/v1/partners';


  public getListPartners() {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.PARTNERS.LIST;
    this.requestOptions.serviceName = this.serviceName;
    return this.get(url, this.requestOptions);
  }


  public exportCard(data: any) {
    this.resetRequest();
    const url = UrlConstant.PARTNERS.EXPORT_CARD;
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.data = data;
    this.requestOptions.observe = 'body';
    this.requestOptions.responseType = 'blob';
    return this.postRequestFile(url, this.requestOptions);
  }

  public getListCardObject(params: any) {
    this.resetRequest();
    const url = UrlConstant.PARTNERS.GET_CARD_OBJECT;
    this.requestOptions.params = params;
    this.requestOptions.serviceName = this.serviceName;
    return this.get(url, this.requestOptions);
  }


}



import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { RequestsModel } from '../../models/request-manager/requests.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant} from "@app/modules/abs/data-access/constant/url.class";

@Injectable({
  providedIn: 'root'
})
export class RequestsService extends BaseCrudService<RequestsModel> {
  protected override serviceName = MICRO_SERVICE.ABS;
  protected override urlEndpoint = '/v1/requests';

  public getAllReasonLeaves() {
    this.resetRequest();
    const url = UrlConstant.API_VERSION + UrlConstant.REASON_TYPES.LIST;
    this.requestOptions.serviceName = this.serviceName;
    return this.get(url, this.requestOptions);
  }
}



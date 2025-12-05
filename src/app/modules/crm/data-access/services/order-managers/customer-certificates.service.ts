import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { CustomerCertificatesModel } from '../../models/order-managers/customer-certificates.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class CustomerCertificatesService extends BaseCrudService<CustomerCertificatesModel> {
  protected override serviceName = MICRO_SERVICE.CRM;
  protected override urlEndpoint = '/v1/customer-certificates';
}



import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { PaymentsModel } from '../../models/category-managers/payments.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant} from "@shared/constant/url.class";

@Injectable({
  providedIn: 'root'
})
export class PaymentsService extends BaseCrudService<PaymentsModel> {
  protected override serviceName = MICRO_SERVICE.CRM;
  protected override urlEndpoint = '/v1/payments';
}



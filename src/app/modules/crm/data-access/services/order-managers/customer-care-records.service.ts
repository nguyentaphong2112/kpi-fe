import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { CustomerCareRecordsModel } from '../../models/order-managers/customer-care-records.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant} from "@app/modules/hrm/data-access/constant/url.class";

@Injectable({
  providedIn: 'root'
})
export class CustomerCareRecordsService extends BaseCrudService<CustomerCareRecordsModel> {
  protected override serviceName = MICRO_SERVICE.CRM;
  protected override urlEndpoint = '/v1/customer-care-records';
}



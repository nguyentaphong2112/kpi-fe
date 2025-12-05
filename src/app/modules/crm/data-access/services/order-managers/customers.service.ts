import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { CustomersModel } from '../../models/order-managers/customers.model';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@shared/constant/url.class';

@Injectable({
  providedIn: 'root'
})
export class CustomersService extends BaseCrudService<CustomersModel> {
  protected override serviceName = MICRO_SERVICE.CRM;
  protected override urlEndpoint = '/v1/customers';

  public getListCustomer(keySearch?: string) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.CUSTOMERS.LIST +
      '?keySearch=' + encodeURIComponent(keySearch || '');
    this.requestOptions.serviceName = this.serviceName;
    return this.get(url, this.requestOptions);
  }

  public customerCare(data: any) {
    this.resetRequest();
    this.requestOptions.data = data;
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + UrlConstant.CUSTOMERS.CARE;
    return this.post(url, this.requestOptions);
  }

}



import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { IncomeItemsModel } from '../../models/income/income-items.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant} from "@app/modules/pit/data-access/constant/url.class";

@Injectable({
  providedIn: 'root'
})
export class IncomeItemsService extends BaseCrudService<IncomeItemsModel> {
  protected override serviceName = MICRO_SERVICE.PIT;
  protected override urlEndpoint = '/v1/income-items';

  getIncomeItemByPeriod(data: any) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.INCOME_ITEM.GET_DATA_BY_PERIOD;
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = data;
    return this.get(url, this.requestOptions);
  }
}



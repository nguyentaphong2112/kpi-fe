import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { IncomeItemsModel } from '../../models/income/income-items.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {IncomeTemplateModel} from "@app/modules/pit/data-access/models/income/income-template.model";

@Injectable({
  providedIn: 'root'
})
export class IncomeTemplateService extends BaseCrudService<IncomeTemplateModel> {
  protected override serviceName = MICRO_SERVICE.PIT;
  protected override urlEndpoint = '/v1/income-template';

  getAll(urlAfter?: string) {
    this.resetRequest();
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '');
    this.requestOptions.serviceName = this.serviceName;
    return this.get(url, this.requestOptions);
  }
}



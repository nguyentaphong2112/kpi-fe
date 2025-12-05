import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { ProductsModel } from '../../models/category-managers/products.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {LogActionsModel} from "@app/modules/crm/data-access/models/category-managers/logActions.model";

@Injectable({
  providedIn: 'root'
})
export class LogActionsService extends BaseCrudService<LogActionsModel> {
  protected override serviceName = MICRO_SERVICE.CRM;
  protected override urlEndpoint = '/v1/log-actions';
}



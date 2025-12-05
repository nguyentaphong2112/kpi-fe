import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { LogActionModel } from '@app/modules/crm/data-access/models/order-managers/log-action.model';

@Injectable({
  providedIn: 'root'
})
export class LogActionService extends BaseCrudService<LogActionModel> {
  protected override serviceName = MICRO_SERVICE.CRM;
  protected override urlEndpoint = '/v1/log-actions';
}



import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CardObjectModel } from '@app/modules/crm/data-access/models/order-managers/card-object.model';

@Injectable({
  providedIn: 'root'
})
export class CardObjectsService extends BaseCrudService<CardObjectModel> {
  protected override serviceName = MICRO_SERVICE.CRM;
  protected override urlEndpoint = '/v1/card-objects';
}



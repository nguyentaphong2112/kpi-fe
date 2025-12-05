import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MatOutgoingShipmentsModel } from '../../models/inventory/mat-outgoing-shipments.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class MatOutgoingShipmentsService extends BaseCrudService<MatOutgoingShipmentsModel> {
  protected override serviceName = MICRO_SERVICE.MAT;
  protected override urlEndpoint = '/v1/outgoing-shipments';
}



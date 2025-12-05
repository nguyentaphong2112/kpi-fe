import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MatTransferringShipmentsModel } from '../../models/inventory/mat-transferring-shipments.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class MatTransferringShipmentsService extends BaseCrudService<MatTransferringShipmentsModel> {
  protected override serviceName = MICRO_SERVICE.MAT;
  protected override urlEndpoint = '/v1/transferring-shipments';
}



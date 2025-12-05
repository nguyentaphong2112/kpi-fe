import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MatIncomingShipmentsModel } from '../../models/inventory/mat-incoming-shipments.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {Observable} from "rxjs";
import {BaseResponse} from "@core/models/base-response";

@Injectable({
  providedIn: 'root'
})
export class MatIncomingShipmentsService extends BaseCrudService<MatIncomingShipmentsModel> {
  protected override serviceName = MICRO_SERVICE.MAT;
  protected override urlEndpoint = '/v1/incoming-shipments';
}



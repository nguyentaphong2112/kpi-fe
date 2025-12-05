import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MatInventoryAdjustmentsModel } from '../../models/inventory/mat-inventory-adjustments.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class MatInventoryAdjustmentsService extends BaseCrudService<MatInventoryAdjustmentsModel> {
  protected override serviceName = MICRO_SERVICE.MAT;
  protected override urlEndpoint = '/v1/inventory-adjustments';
}



import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MatEquipmentsModel } from '../../models/category/mat-equipments.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class MatEquipmentsService extends BaseCrudService<MatEquipmentsModel> {
  protected override serviceName = MICRO_SERVICE.MAT;
  protected override urlEndpoint = '/v1/equipments';
}



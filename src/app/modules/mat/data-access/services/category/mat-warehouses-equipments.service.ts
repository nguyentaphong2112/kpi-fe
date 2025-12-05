import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import {MICRO_SERVICE} from '@core/constant/system.constants';

@Injectable({
  providedIn: 'root'
})
export class MatWarehousesEquipmentsService extends BaseCrudService<any> {
  protected override serviceName = MICRO_SERVICE.MAT;
  protected override urlEndpoint = '/v1/warehouse-equipments';
}



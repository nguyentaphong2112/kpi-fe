import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MatWarehousesModel } from '../../models/category/mat-warehouses.model';
import {MICRO_SERVICE} from '@core/constant/system.constants';

@Injectable({
  providedIn: 'root'
})
export class MatWarehousesService extends BaseCrudService<MatWarehousesModel> {
  protected override serviceName = MICRO_SERVICE.MAT;
  protected override urlEndpoint = '/v1/warehouses';
}



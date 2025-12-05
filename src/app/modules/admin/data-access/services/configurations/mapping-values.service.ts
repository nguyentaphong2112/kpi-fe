import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MappingValuesModel } from '../../models/configurations/mapping-values.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class MappingValuesService extends BaseCrudService<MappingValuesModel> {
  protected override serviceName = MICRO_SERVICE.ADMIN;
  protected override urlEndpoint = '/v1/mapping-values';
}



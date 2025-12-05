import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { ConfigMappingsModel } from '../../models/configurations/config-mappings.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class ConfigMappingsService extends BaseCrudService<ConfigMappingsModel> {
  protected override serviceName = MICRO_SERVICE.ADMIN;
  protected override urlEndpoint = '/v1/config-mappings';
}



import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { ConfigPagesModel } from '../../models/configurations/config-pages.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class ConfigPagesService extends BaseCrudService<ConfigPagesModel> {
  protected override serviceName = MICRO_SERVICE.ADMIN;
  protected override urlEndpoint = '/v1/config-pages';
}



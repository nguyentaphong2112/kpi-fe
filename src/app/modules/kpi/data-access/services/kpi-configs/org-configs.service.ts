import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { OrgConfigsModel } from '../../models/kpi-configs/org-configs.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class OrgConfigsService extends BaseCrudService<OrgConfigsModel> {
  protected override serviceName = MICRO_SERVICE.KPI;
  protected override urlEndpoint = '/v1/org-configs';
}



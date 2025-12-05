import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { IndicatorUsingScopesModel } from '../../models/kpi-managers/indicator-using-scopes.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class IndicatorUsingScopesService extends BaseCrudService<IndicatorUsingScopesModel> {
  protected override serviceName = MICRO_SERVICE.KPI;
  protected override urlEndpoint = '/v1/indicator-using-scopes';
}



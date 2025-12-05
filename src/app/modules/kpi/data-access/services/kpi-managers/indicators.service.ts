import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { IndicatorsModel } from '../../models/kpi-managers/indicators.model';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';

@Injectable({
  providedIn: 'root'
})
export class IndicatorsService extends BaseCrudService<IndicatorsModel> {
  protected override serviceName = MICRO_SERVICE.KPI;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.INDICATOR.PREFIX;
}



import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { IndicatorConversionsModel } from '../../models/kpi-managers/indicator-conversions.model';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicatorConversionsService extends BaseCrudService<IndicatorConversionsModel> {
  protected override serviceName = MICRO_SERVICE.KPI;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.INDICATOR_CONVERSION.PREFIX;
}



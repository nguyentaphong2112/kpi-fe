import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { EvaluationPeriodsModel } from '../../models/kpi-managers/evaluation-periods.model';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';

@Injectable({
  providedIn: 'root'
})
export class EvaluationPeriodsService extends BaseCrudService<EvaluationPeriodsModel> {
  protected override serviceName = MICRO_SERVICE.KPI;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.EVALUATION_PERIODS.PREFIX;
}



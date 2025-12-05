import { Injectable } from '@angular/core';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Injectable({
  providedIn: 'root'
})
export class IndicatorMasterService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.KPI;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.INDICATOR_MASTER.PREFIX;
}

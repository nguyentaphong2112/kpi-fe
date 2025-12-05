import { Injectable } from '@angular/core';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { UrlConstant } from '../constant/url.class';

@Injectable({
  providedIn: 'root'
})
export class SearchFormService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.ABS;
  protected override urlEndpoint = UrlConstant.API_VERSION;

  getData(dataSourceValue: string) {
    this.resetRequest();
    return this.get(dataSourceValue);
  }
}

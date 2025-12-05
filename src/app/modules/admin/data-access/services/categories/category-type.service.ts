import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';

@Injectable({
  providedIn: 'root'
})
export class CategoryTypeService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.ADMIN;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.CATEGORY.CATEGORY_TYPE;
}

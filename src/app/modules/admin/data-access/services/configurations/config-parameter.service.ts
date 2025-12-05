import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ConfigParameterService extends BaseCrudService<NzSafeAny>  {
  protected override serviceName = MICRO_SERVICE.ADMIN;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.PARAMETERS.GET_PARAMETERS;

  searchData(searchParam: HttpParams, pagination: { startRecord: number, pageSize: number }, configGroup: string, configParameterId: number) {
    if (pagination) searchParam = searchParam.appendAll(pagination);
    const url = UrlConstant.API_VERSION + UrlConstant.CONFIGS_PARAMETERS.PREFIX.replace('{configGroup}', configGroup)  + '/' + configParameterId;
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = searchParam;
    return this.get(url, this.requestOptions);
  }

}

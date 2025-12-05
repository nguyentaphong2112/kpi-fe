import { Injectable } from '@angular/core';
import {BaseCrudService} from "@core/services/base/base-crud.service";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {UrlConstant} from "@app/modules/abs/data-access/constant/url.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class RequestLeavesService extends BaseCrudService<NzSafeAny> {
  readonly baseUrl = UrlConstant.API_VERSION + UrlConstant.REQUEST_PATH;
  readonly serviceName = MICRO_SERVICE.ABS;

  public caculateLeaves(params: any) {
    this.resetRequest();
    this.requestOptions.params = params;
    this.requestOptions.serviceName = MICRO_SERVICE.ABS_MANAGEMENT;
    const url = `${this.baseUrl}/caculate-leaves`;
    return this.get(url, this.requestOptions);
  }


}

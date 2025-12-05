import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { WorkdayTypesModel } from '../../models/category-manager/workday-types.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant} from "@app/modules/abs/data-access/constant/url.class";

@Injectable({
  providedIn: 'root'
})
export class WorkdayTypesService extends BaseCrudService<WorkdayTypesModel> {
  override serviceName = MICRO_SERVICE.ABS;
  readonly urlEndpoint = UrlConstant.API_VERSION + UrlConstant.WORKDAY_TYPE.PREFIX;

  public getData() {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.hideLoading = true;
    const url = this.urlEndpoint + "/list";
    return this.get(url, this.requestOptions);
  }

}



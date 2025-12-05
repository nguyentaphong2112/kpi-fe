import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { AnnualLeavesModel } from '../../models/category-manager/annual-leaves.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant} from "@app/modules/abs/data-access/constant/url.class";

@Injectable({
  providedIn: 'root'
})
export class AnnualLeavesService extends BaseCrudService<AnnualLeavesModel> {
  calculateAnnualLeave(data: any) {
    this.resetRequest();
        const url = `${UrlConstant.API_VERSION}${UrlConstant.SEARCH_FORM.ANNUAL_LEAVES_CALCULATE}/` + data.year
        this.requestOptions.serviceName = this.serviceName;
        this.requestOptions.data = data;
        return this.post(url, this.requestOptions);
  }
  protected override serviceName = MICRO_SERVICE.ABS;
  protected override urlEndpoint = '/v1/annual-leaves';
}



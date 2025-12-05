import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { ContributionRatesModel } from '../../models/configs/contribution-rates.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class ContributionRatesService extends BaseCrudService<ContributionRatesModel> {
  protected override serviceName = MICRO_SERVICE.ICN;
  protected override urlEndpoint = '/v1/contribution-rate';
}



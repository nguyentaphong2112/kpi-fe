import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { TaxCommitmentsModel } from '../../models/commitments/tax-commitments.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class TaxCommitmentsService extends BaseCrudService<TaxCommitmentsModel> {
  protected override serviceName = MICRO_SERVICE.PIT;
  protected override urlEndpoint = '/v1/tax-commitment';
}



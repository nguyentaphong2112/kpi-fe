import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { InternshipSessionDetailsModel } from '../../models/internship-managers/internship-session-details.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class InternshipSessionDetailsService extends BaseCrudService<InternshipSessionDetailsModel> {
  protected override serviceName = MICRO_SERVICE.LMS;
  protected override urlEndpoint = '/v1/internship-session-details';
}



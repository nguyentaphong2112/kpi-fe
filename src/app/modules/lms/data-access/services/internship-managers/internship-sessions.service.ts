import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { InternshipSessionsModel } from '../../models/internship-managers/internship-sessions.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class InternshipSessionsService extends BaseCrudService<InternshipSessionsModel> {
  protected override serviceName = MICRO_SERVICE.LMS;
  protected override urlEndpoint = '/v1/internship-sessions';
}



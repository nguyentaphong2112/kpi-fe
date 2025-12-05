import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { SessionsModel } from '../../models/sessions-manager/sessions.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class SessionsService extends BaseCrudService<SessionsModel> {
  protected override serviceName = MICRO_SERVICE.EXAM;
  protected override urlEndpoint = '/v1/sessions';
}



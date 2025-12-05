import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { ExternalTrainingsModel } from '../../models/training-managers/external-trainings.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class ExternalTrainingsService extends BaseCrudService<ExternalTrainingsModel> {
  protected override serviceName = MICRO_SERVICE.LMS;
  protected override urlEndpoint = '/v1/external-trainings';
}



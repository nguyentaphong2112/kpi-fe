import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { TrainingProcessModel } from '../../models/training-managers/training-process.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class TrainingProcessService extends BaseCrudService<TrainingProcessModel> {
  protected override serviceName = MICRO_SERVICE.LMS;
  protected override urlEndpoint = '/v1/training-process';
}



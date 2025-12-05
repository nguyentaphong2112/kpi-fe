import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MentoringTrainersModel } from '../../models/mentorings/mentoring-trainers.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class MentoringTrainersService extends BaseCrudService<MentoringTrainersModel> {
  protected override serviceName = MICRO_SERVICE.LMS;
  protected override urlEndpoint = '/v1/mentoring-trainers';
}



import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MentoringTraineesModel } from '../../models/mentorings/mentoring-trainees.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class MentoringTraineesService extends BaseCrudService<MentoringTraineesModel> {
  protected override serviceName = MICRO_SERVICE.LMS;
  protected override urlEndpoint = '/v1/mentoring-trainees';
}



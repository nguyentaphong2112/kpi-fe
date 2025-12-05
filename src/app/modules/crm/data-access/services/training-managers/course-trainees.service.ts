import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { CourseTraineesModel } from '../../models/training-managers/course-trainees.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class CourseTraineesService extends BaseCrudService<CourseTraineesModel> {
  protected override serviceName = MICRO_SERVICE.CRM;
  protected override urlEndpoint = '/v1/course-trainees';
}



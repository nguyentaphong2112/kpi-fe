import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { CourseLessonsModel } from '../../models/training-managers/course-lessons.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class CourseLessonsService extends BaseCrudService<CourseLessonsModel> {
  protected override serviceName = MICRO_SERVICE.CRM;
  protected override urlEndpoint = '/v1/course-lessons';
}



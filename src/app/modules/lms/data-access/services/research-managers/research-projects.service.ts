import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { ResearchProjectsModel } from '../../models/research-managers/research-projects.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class ResearchProjectsService extends BaseCrudService<ResearchProjectsModel> {
  protected override serviceName = MICRO_SERVICE.LMS;
  protected override urlEndpoint = '/v1/research-projects';
}



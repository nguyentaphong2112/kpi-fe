import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { ResearchProjectLifecyclesModel } from '../../models/research-managers/research-project-lifecycles.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class ResearchProjectLifecyclesService extends BaseCrudService<ResearchProjectLifecyclesModel> {
  protected override serviceName = MICRO_SERVICE.LMS;
  protected override urlEndpoint = '/v1/research-project-lifecycles';
}



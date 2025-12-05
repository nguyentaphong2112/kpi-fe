import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { ResearchProjectMembersModel } from '../../models/research-managers/research-project-members.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class ResearchProjectMembersService extends BaseCrudService<ResearchProjectMembersModel> {
  protected override serviceName = MICRO_SERVICE.LMS;
  protected override urlEndpoint = '/v1/research-project-members';
}



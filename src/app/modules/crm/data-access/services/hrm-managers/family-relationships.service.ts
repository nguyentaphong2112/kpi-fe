import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { FamilyRelationshipsModel } from '../../models/hrm-managers/family-relationships.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class FamilyRelationshipsService extends BaseCrudService<FamilyRelationshipsModel> {
  protected override serviceName = MICRO_SERVICE.CRM;
  protected override urlEndpoint = '/v1/family-relationships';
}



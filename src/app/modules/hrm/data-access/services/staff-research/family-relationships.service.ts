import {Injectable} from '@angular/core';
import {BaseCrudService} from '@core/services/base/base-crud.service';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {FamilyRelationshipsModel} from '../../models/research/family-relationships.model';

@Injectable({
  providedIn: 'root'
})
export class FamilyRelationshipsService extends BaseCrudService<FamilyRelationshipsModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = '/v1/family-relationships';
}



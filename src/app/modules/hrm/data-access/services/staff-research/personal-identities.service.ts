import {Injectable} from '@angular/core';
import {BaseCrudService} from '@core/services/base/base-crud.service';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {PersonalIdentitiesModel} from '../../models/research/personal-identities.model';

@Injectable({
  providedIn: 'root'
})
export class PersonalIdentitiesService extends BaseCrudService<PersonalIdentitiesModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = '/v1/personal-identities';
}



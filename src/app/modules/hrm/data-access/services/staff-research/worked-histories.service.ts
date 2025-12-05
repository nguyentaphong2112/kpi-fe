import {Injectable} from '@angular/core';
import {BaseCrudService} from '@core/services/base/base-crud.service';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {WorkedHistoriesModel} from '../../models/research/worked-histories.model';

@Injectable({
  providedIn: 'root'
})
export class WorkedHistoriesService extends BaseCrudService<WorkedHistoriesModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = '/v1/worked-histories';
}



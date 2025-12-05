import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { AwardProcessModel } from '../../models/research/award-process.model';

@Injectable({
  providedIn: 'root'
})
export class AwardProcessService extends BaseCrudService<AwardProcessModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = '/v1/award-process';
}



import {Injectable} from '@angular/core';
import {BaseCrudService} from '@core/services/base/base-crud.service';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {ConcurrentProcessModel} from '../../models/research/concurrent-process.model';

@Injectable({
  providedIn: 'root'
})
export class ConcurrentProcessService extends BaseCrudService<ConcurrentProcessModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = '/v1/concurrent-process';
}



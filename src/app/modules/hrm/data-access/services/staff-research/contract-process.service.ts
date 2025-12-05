import {Injectable} from '@angular/core';
import {BaseCrudService} from '@core/services/base/base-crud.service';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {ContractProcessModel} from "@app/modules/hrm/data-access/models/research/contract-process.model";

@Injectable({
  providedIn: 'root'
})
export class ContractProcessService extends BaseCrudService<ContractProcessModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = '/v1/contract-process';
}



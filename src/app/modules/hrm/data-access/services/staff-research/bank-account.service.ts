import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { BankAccountModel } from '@app/modules/hrm/data-access/models/research/bank-accounts.model';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService extends BaseCrudService<BankAccountModel> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = '/v1/bank-accounts';
}



import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { InsuranceRetractionsModel } from '../../models/caculate/insurance-retractions.model';
import { MICRO_SERVICE } from '@core/constant/system.constants';

@Injectable({
  providedIn: 'root'
})
export class InsuranceRetractionsService extends BaseCrudService<InsuranceRetractionsModel> {
  protected override serviceName = MICRO_SERVICE.ICN;
  protected override urlEndpoint = '/v1/insurance-retractions';

  onCalculate(payload: any) {
    this.resetRequest();
    this.requestOptions.params = payload;
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + '/calculate';
    return this.post(url, this.requestOptions);
  }

  onCalculateList(payload: any) {
    this.resetRequest();
    this.requestOptions.params = payload;
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + '/calculate-by-list-period';
    return this.post(url, this.requestOptions);
  }

}

import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { InsuranceContributionsModel } from '../../models/caculate/insurance-contributions.model';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { REQUEST_TYPE } from '@shared/constant/common';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Observable } from 'rxjs';
import { BaseResponse } from '@core/models/base-response';

@Injectable({
  providedIn: 'root'
})
export class InsuranceContributionsService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.ICN;
  protected override urlEndpoint = '/v1/insurance-contributions';

  onChangeStatusById(data: NzSafeAny, typeRequest: number, urlAfter?: string) {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '');
    if (typeRequest === REQUEST_TYPE.FORM_DATA) {
      this.requestOptions.data = CommonUtils.convertFormData(data);
      return this.put(url, this.requestOptions);
    } else if (typeRequest === REQUEST_TYPE.FORM_DATA_FILE) {
      this.requestOptions.data = CommonUtils.convertToFormDataFile(data);
      return this.put(url, this.requestOptions);
    } else {
      this.requestOptions.data = data;
      return this.put(url, this.requestOptions);
    }
  }

  public postParams(data: NzSafeAny, urlAfter?: string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '');
    this.requestOptions.params = data;
    return this.post(url, this.requestOptions);

  }

  public approveAllPut(data: any, urlAfter?: string) {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '/approve-all');
    this.requestOptions.data = data;
    return this.put(url, this.requestOptions);
  }

  public onUndoApproveAllPut(data: any, urlAfter?: string) {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '/undo-approve-all');
    this.requestOptions.data = data;
    return this.put(url, this.requestOptions);
  }


  public createOrImport2(data: NzSafeAny, typeRequest: number, urlAfter?: string, params?: NzSafeAny): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '');
    if (typeRequest === REQUEST_TYPE.FORM_DATA) {
      this.requestOptions.data = CommonUtils.convertFormData(data);
      this.requestOptions.params = params;
      return this.post(url, this.requestOptions);
    } else if (typeRequest === REQUEST_TYPE.FORM_DATA_FILE) {
      this.requestOptions.data = CommonUtils.convertToFormDataFile(data);
      this.requestOptions.params = params;
      return this.post(url, this.requestOptions);
    } else {
      this.requestOptions.data = data;
      this.requestOptions.params = params;
      return this.post(url, this.requestOptions);
    }
  }

  public switchType(params?: NzSafeAny, urlAfter?: string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '') + '/{id}'.replace('{id}', params['id']);
    this.requestOptions.params = params;
    return this.put(url, this.requestOptions);
  }
}



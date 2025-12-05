import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { EmployeeChangesModel } from '../../models/caculate/employee-changes.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {Observable} from "rxjs";
import {BaseResponse} from "@core/models/base-response";
import {REQUEST_TYPE} from "@shared/constant/common";
import {CommonUtils} from "@shared/services/common-utils.service";

@Injectable({
  providedIn: 'root'
})
export class EmployeeChangesService extends BaseCrudService<EmployeeChangesModel> {
  protected override serviceName = MICRO_SERVICE.ICN;
  protected override urlEndpoint = '/v1/employee-changes';

  onMakeList(payload:any) {
    this.resetRequest();
    this.requestOptions.params = payload;
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + "/make-list"
    return this.post(url, this.requestOptions);
  }

  approveAll(payload:any) {
    this.resetRequest();
    this.requestOptions.params = payload;
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + "/approve-all"
    return this.put(url, this.requestOptions);
  }

  undoApproveAll(payload:any) {
    this.resetRequest();
    this.requestOptions.params = payload;
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + "/undo-approve-all"
    return this.put(url, this.requestOptions);
  }

  approveById(payload:any) {
    this.resetRequest();
    this.requestOptions.data = payload;
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + "/approve-by-id"
    return this.put(url, this.requestOptions);
  }

  undoApproveById(payload:any) {
    this.resetRequest();
    this.requestOptions.data = payload;
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + "/undo-approve-by-id"
    return this.put(url, this.requestOptions);
  }

  override update(data: EmployeeChangesModel, typeRequest: number, urlAfter?: string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '');
    if (typeRequest === REQUEST_TYPE.FORM_DATA) {
      this.requestOptions.data = CommonUtils.convertFormData(data);
      return this.post(url, this.requestOptions);
    } else if (typeRequest === REQUEST_TYPE.FORM_DATA_FILE) {
      this.requestOptions.data = CommonUtils.convertToFormDataFile(data);
      return this.post(url, this.requestOptions);
    } else {
      this.requestOptions.data = data;
      return this.post(url, this.requestOptions);
    }
  }
}



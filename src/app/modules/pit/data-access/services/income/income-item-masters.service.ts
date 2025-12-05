import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { IncomeItemMastersModel } from '../../models/income/income-item-masters.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant} from "@app/modules/pit/data-access/constant/url.class";
import {HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {BaseResponse} from "@core/models/base-response";

@Injectable({
  providedIn: 'root'
})
export class IncomeItemMastersService extends BaseCrudService<IncomeItemMastersModel> {
  protected override serviceName = MICRO_SERVICE.PIT;
  protected override urlEndpoint = '/v1/income-item-masters';

  public downloadFileIncome(id: any, params?: HttpParams) {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = params;
    const url = `${this.urlEndpoint}/download/${id}`;
    return this.getRequestFile(url, this.requestOptions);
  }

  calTax(id: number): Observable<any> {
    const urlRequest = this.urlEndpoint + `/tax-calculate/${id}`;
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    return this.put(urlRequest, this.requestOptions);
  }

}



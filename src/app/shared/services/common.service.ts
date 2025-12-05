import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../core/models/base-response';
import { BaseService } from '@core/services/base/base.service';
import { UrlConstant } from '../constant/url.class';
import { MICRO_SERVICE } from '../../core/constant/system.constants';
import { FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService extends BaseService {
  doTaxDownloadAttachFile(docId: number, security: string, urlEnd: string, serviceName: string) {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    const url = UrlConstant.API_VERSION + urlEnd + `?docId=${docId}&security=${security}`;
    return this.getRequestFile(url, this.requestOptions);
  }

  public doDownloadFileByName(fileName: string, urlEnd: string, serviceName: string) {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    const url = UrlConstant.API_VERSION + urlEnd + `?fileName=${fileName}`;
    return this.getRequestFile(url, this.requestOptions);
  }

  public downloadTemplate(urlEnd: string, serviceName: string) {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    const url = UrlConstant.API_VERSION + urlEnd;
    return this.getRequestFile(url, this.requestOptions);
  }

  public doImport(data: FormData, urlEnd: string, serviceName: string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    this.requestOptions.data = data;
    const url = UrlConstant.API_VERSION + urlEnd;
    return this.post(url, this.requestOptions);
  }

  public rejectByList(listId: number[], urlEndpoint: string, rejectReason: string, serviceName: string) {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    this.requestOptions.data = { listId, rejectReason };
    const url = UrlConstant.API_VERSION + urlEndpoint;
    return this.post(url, this.requestOptions);
  }

  public approveAll(urlEndpoint: string, form: FormGroup, serviceName: string) {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    this.requestOptions.data = form.value;
    const url = UrlConstant.API_VERSION + urlEndpoint;
    return this.post(url, this.requestOptions);
  }

  public approveByList(listId: number[], urlEndpoint: string, serviceName: string) {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    let params = new HttpParams();
    if (listId.length > 0) {
      params = params.set('listId', listId.join(','));
    }
    this.requestOptions.params = params;
    const url = UrlConstant.API_VERSION + urlEndpoint;
    return this.post(url, this.requestOptions);
  }
}



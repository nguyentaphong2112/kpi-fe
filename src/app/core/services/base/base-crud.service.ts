import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { MICRO_SERVICE } from '../../constant/system.constants';
import { BaseResponse } from '../../models/base-response';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';

@Injectable({
  providedIn: 'root'
})
export class BaseCrudService<T> extends BaseService {
  protected serviceName = MICRO_SERVICE.DEFAULT;
  protected urlEndpoint = '';

  public getFilterResearch(searchParam: any, pagination: { startRecord: number, pageSize: number }, urlAfter?: string, isLoading?: boolean): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    // add cache
    // this.requestOptions.cacheGetRequest = true;
    this.requestOptions.hideLoading = isLoading;
    this.requestOptions.params = { ...searchParam, ...pagination };
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '');
    return this.get(url, this.requestOptions);
  }

  public export(searchParam: any, urlAfter?: string, isPost?: boolean, paramPost?: any, responseType?: string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.responseType = responseType ?? 'blob';
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '/export');
    if (isPost) {
      this.requestOptions.data = searchParam;
      this.requestOptions.params = paramPost;
      return this.postRequestFile(url, this.requestOptions);
    } else {
      this.requestOptions.params = searchParam;
      return this.getRequestFile(url, this.requestOptions);
    }
  }

  public getList(searchParam: any, urlAfter?: string, isCache = false): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = searchParam;
    this.requestOptions.cacheGetRequest = isCache;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '');
    return this.get(url, this.requestOptions);
  }

  public getData(searchParam: any, urlAfter?: string, isCache = false): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = searchParam;
    this.requestOptions.cacheGetRequest = isCache;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '');
    return this.get(url, this.requestOptions);
  }

  public findOneById(id: any, urlAfter?: string, isCache = false): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.cacheGetRequest = isCache;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '') + '/{id}'.replace('{id}', id);
    return this.get(url, this.requestOptions);
  }

  public createOrImport(data: T, typeRequest: number, urlAfter?: string): Observable<BaseResponse<any>> {
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

  public update(data: T, typeRequest: number, urlAfter?: string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '') + '/{id}'.replace('{id}', data['id']);
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

  public deleteById(id: string, urlAfter?: string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '') + `/${id}`;
    return this.delete(url, this.requestOptions);
  }

  public lockOrUnlockById(id: string, urlAfter?: string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '') + `/${id}`;
    return this.put(url, this.requestOptions);
  }

  public downloadFile(urlAfter: string = this.urlEndpoint, params?: HttpParams | {
    mediaType: string;
    platformType: string
  } | Record<string, any> | { isNotAutoPreview: boolean }): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = params;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '');
    return this.getRequestFile(url, this.requestOptions);
  }

  public downloadFileByName(url: string, params?: HttpParams | {
    mediaType: string;
    platformType: string
  } | Record<string, any> | { isNotAutoPreview: boolean }): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.params = params;
    return this.getRequestFile(url, this.requestOptions);
  }

  public approveByList(listId: number[], urlAfter?: string) {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '/approve-by-list');
    this.requestOptions.params = { listId: listId.join(',') };
    return this.put(url, this.requestOptions);
  }

  public approveAll(data: any, urlAfter?: string) {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '/approve-all');
    this.requestOptions.data = data;
    return this.put(url, this.requestOptions);
  }

  public onUndoApproveAll(data: any, urlAfter?: string) {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '/undo-approve-all');
    this.requestOptions.data = data;
    return this.put(url, this.requestOptions);
  }

  public rejectByList(listId: number[], rejectReason: string, urlAfter?: string) {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '/reject-by-list');
    this.requestOptions.data = { listId, rejectReason };
    return this.put(url, this.requestOptions);
  }
}

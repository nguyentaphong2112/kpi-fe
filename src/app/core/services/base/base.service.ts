import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MICRO_SERVICE } from '../../constant/system.constants';
import { environment } from '@env/environment';
import { CacheService } from '@core/services/cache.service';
import { Router } from '@angular/router';
import { SessionService } from '@core/services/session.service';

export interface RequestOptions {
  data?: any;
  serviceName?: string;
  cacheGetRequest?: boolean;
  cacheGroup?: string;
  ttl?: number;
  params?: { [param: string]: string | string[] | boolean | number } | HttpParams;
  showLoadingImmediately?: boolean;
  hideLoading?: boolean;
  ignoreError?: boolean;
  ignoreUnknowError?: boolean;
  observe?: 'response' | 'body';
  responseType?: string | 'blob' | 'json';
  withCredentials?: boolean;
}

@Injectable()
export class BaseService {

  constructor(protected readonly injector: Injector) {
    this.router = this.injector.get(Router);
    this.httpClient = this.injector.get(HttpClient);
    this.cacheService = this.injector.get(CacheService);
    this.sessionService = this.injector.get(SessionService);
  }

  public servicePath: string;
  public loadingData = false;
  protected requestOptions: RequestOptions;

  protected httpClient: HttpClient;
  protected router: Router;
  private cacheService: CacheService;
  private sessionService: SessionService;

  static getBaseUrl(serviceName?: string): string {
    let baseUrl = 'N/A';
    switch (serviceName) {
      case MICRO_SERVICE.DEFAULT:
        baseUrl = environment.backend.baseUrl;
        break;
      case MICRO_SERVICE.ADMIN:
        baseUrl = environment.backend.admin;
        break;
      case MICRO_SERVICE.LIBRARY:
        baseUrl = environment.backend.library;
        break;
      case MICRO_SERVICE.HRM:
        baseUrl = environment.backend.hrm;
        break;
      case MICRO_SERVICE.KPI:
        baseUrl = environment.backend.kpi;
        break;
      case MICRO_SERVICE.ABS:
        baseUrl = environment.backend.abs;
        break;
      case MICRO_SERVICE.CRM:
        baseUrl = environment.backend.crm;
        break;
      case MICRO_SERVICE.LMS:
        baseUrl = environment.backend.lms;
        break;
      case MICRO_SERVICE.MAT:
        baseUrl = environment.backend.mat;
        break;
      case MICRO_SERVICE.PIT:
        baseUrl = environment.backend.pit;
        break;
      case MICRO_SERVICE.ICN:
        baseUrl = environment.backend.icn;
        break;
      case MICRO_SERVICE.PTX:
        baseUrl = environment.backend.ptx;
        break;
      case MICRO_SERVICE.EXAM:
        baseUrl = environment.backend.exam;
        break;
      case MICRO_SERVICE.SSO:
        baseUrl = environment.backend.sso;
        break;
      default: baseUrl = '';
    }
    return baseUrl;
  }

  protected cleanCache() {
    this.sessionService.clearSession();
    this.cacheService.map = new Map<string, any>();
    this.cacheService.mapGroup = new Map<string, Set<string>>();
  }

  /**
   * handleError
   */
  public handleError(error: any) {
    return throwError(error.error);
  }

  /**
   * make get request
   */
  protected get(endpointUrl: string, options?: RequestOptions): Observable<any> {
    const requestOptions = this.createRequestOptions(options);
    const urlPath = BaseService.getBaseUrl(options.serviceName) + endpointUrl;
    const urlFull = urlPath + (requestOptions.params ? ('?' + (requestOptions.params as any).toString()) : '');
    if (options.cacheGetRequest && this.cacheService.getCache(urlFull)) {
      return this.cacheService.getCache(urlFull);
    } else {
      return this.httpClient.get(urlPath, requestOptions).pipe(map(res => {
        this.cacheService.setCache(urlFull, res, options.cacheGroup, options.ttl);
        return res;
      }));
    }
  }

  /**
   * make get request with async
   */
  protected async getWithAsync(endpointUrl: string, options: RequestOptions) {
    const requestOptions = this.createRequestOptions(options);
    const urlPath = BaseService.getBaseUrl(options.serviceName) + endpointUrl;
    const urlFull = urlPath + requestOptions.params ? ('?' + (requestOptions.params as any).toString()) : '';
    if (options.cacheGetRequest && this.cacheService.getCache(urlFull)) {
      return await this.cacheService.getCache(urlFull).toPromise();
    } else {
      return await this.httpClient.get(urlPath, requestOptions).pipe(map(res => {
        this.cacheService.setCache(urlFull, res, options.cacheGroup, options.ttl);
        return res;
      })).toPromise();
    }
  }

  /**
   * make post request
   */
  protected post(endpointUrl: string, options: RequestOptions): Observable<any> {
    const requestOptions = this.createRequestOptions(options);
    const urlPath = BaseService.getBaseUrl(options.serviceName) + endpointUrl;
    return this.httpClient.post(urlPath, options && options.data ? options.data : null, requestOptions).pipe(
      catchError(err => {
        return throwError(err.error);
      })
    );
  }

  /**
   * make put request
   */
  protected put(endpointUrl: string, options: RequestOptions): Observable<any> {
    const requestOptions = this.createRequestOptions(options);
    const urlPath = BaseService.getBaseUrl(options.serviceName) + endpointUrl;
    return this.httpClient.put(urlPath, options && options.data ? options.data : null, requestOptions).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * make delete request
   */
  protected delete(endpointUrl: string, options?: RequestOptions): Observable<any> {
    const requestOptions = this.createRequestOptions(options);
    const urlPath = BaseService.getBaseUrl(options.serviceName) + endpointUrl;
    return this.httpClient.delete(urlPath, requestOptions).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * make post request for file
   */
  protected postRequestFile(endpointUrl: string, options: RequestOptions): Observable<any> {
    options.responseType = options.responseType ?? 'blob';
    options.observe = options.responseType === 'json' ? 'body' : 'response';
    const requestOptions = this.createRequestOptions(options);
    const urlPath = BaseService.getBaseUrl(options.serviceName) + endpointUrl;
    return this.httpClient.post(urlPath, options && options.data ? options.data : null, requestOptions).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * d2t make get request to get file
   * @param endpointUrl
   * @param options
   * @param serviceName
   * @returns
   */
  protected getRequestFile(endpointUrl: string, options: RequestOptions): Observable<any> {
    options = {
      ...options,
      responseType: 'blob' as 'json',
      observe: 'response' as 'body'
    };
    const requestOptions = this.createRequestOptions(options);
    const urlPath = BaseService.getBaseUrl(options.serviceName) + endpointUrl;
    return this.httpClient.get(urlPath, requestOptions).pipe(
      catchError(this.handleError)
    );
  }

  private createRequestOptions(options?: RequestOptions): {
    headers: null;
    params: null;
    observe: any;
    responseType: any
  } {
    const requestOptions = {
      headers: null,
      params: null,
      observe: 'body' as any,
      responseType: ((options && options.responseType) ? options.responseType : 'json') as 'json'
    };
    if (options) {
      requestOptions.headers = new HttpHeaders({ serviceName: options.serviceName });
      requestOptions.params = options.params && options.params instanceof HttpParams ? options.params : this.toParams(options.params);
      requestOptions.observe = options.observe ? options.observe : 'body';
      if (options.hideLoading) {
        requestOptions.headers = new HttpHeaders({ ignoreLoadingBar: 'true' });
      }
    }
    return requestOptions;
  }

  public resetRequest() {
    this.requestOptions = { data: {}, params: {} };
  }

  protected toParams(objParams: any): HttpParams {
    const params = { data: new HttpParams() };
    for (const l1PropertyName in objParams) {
      if (objParams.hasOwnProperty(l1PropertyName) && objParams[l1PropertyName.toString()] != null) {
        const l1Property = objParams[l1PropertyName.toString()];
        if (typeof l1Property === 'object') {
          if (Array.isArray(l1Property)) {
            this.toParamsAppend(params, l1PropertyName, l1Property);
          } else {
            this.toParamsChild(params, l1PropertyName, l1Property);
          }
        } else {
          this.toParamsIfHasValue(params, l1PropertyName, l1Property);
        }
      }
    }
    return params.data;
  }

  private toParamsAppend(params: any, l1PropertyName: any, l1Property: any) {
    for (const item of l1Property) {
      params.data = params.data.append(l1PropertyName, item);
    }
  }

  private toParamsChild(params: any, l1PropertyName: any, l1Property: any) {
    for (const l2PropertyName in l1Property) {
      if (l1Property.hasOwnProperty(l2PropertyName) && l1Property[l2PropertyName.toString()] != null) {
        const level2Property = l1Property[l2PropertyName.toString()];
        params.data = params.data.set(`${l1PropertyName}.${l2PropertyName}`, level2Property);
      }
    }
  }

  private toParamsIfHasValue(params: any, l1PropertyName: any, l1Property: any) {
    if (l1Property !== '' && l1Property !== null && l1Property !== undefined) {
      params.data = params.data.set(l1PropertyName, l1Property);
    }
  }
}

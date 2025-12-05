import { Injectable } from '@angular/core';
import { BaseService } from '@core/services/base/base.service';
import { MICRO_SERVICE } from '../../core/constant/system.constants';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService extends BaseService {
  readonly serviceName = MICRO_SERVICE.ADMIN;

  downloadFileService(docId: number, security: string, urlEnd: string, serviceName: string) {
    this.resetRequest();
    const url = urlEnd + `?docId=${docId}&security=${security}`;
    this.requestOptions.serviceName = serviceName ?? this.serviceName;
    return this.getRequestFile(url,this.requestOptions );
  }

  doExportFile(urlEndpoint: string, searchParam: HttpParams, serviceName: string) {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName ?? this.serviceName;
    this.requestOptions.params = searchParam;
    return this.getRequestFile(urlEndpoint, this.requestOptions);
  }


  doDownloadFileByName(urlEndpoint: string, searchParam: any, serviceName: string) {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName ?? this.serviceName;
    this.requestOptions.params = searchParam;
    return this.getRequestFile(urlEndpoint, this.requestOptions);
  }

// /v1/download/temp-file
//   public doDownloadFileByName(fileName: string, urlEnd: string, serviceName: string) {
//     const url = UrlConstant.API_VERSION + urlEnd + '?fileName=' + fileName;
//     return this.getRequestFile(url, {}, serviceName);
//   }

  // public downloadTemplate(urlEndpoint: string) {
  //   const url = UrlConstant.API_VERSION + urlEndpoint;
  //   return this.getRequestFile(url, {}, environment.backend.taxServiceBackend + url);
  // }
  //
  // public doImport(endpoint: string, data: FormData): Observable<BaseResponse<any>> {
  //   const url = UrlConstant.API_VERSION + endpoint;
  //   return this.post(url, data, {}, MICRO_SERVICE.TAX_SERVICE);
  // }
}

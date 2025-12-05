import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '@core/services/base/base.service';
import { BaseResponse } from '@core/models/base-response';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@shared/constant/url.class';

@Injectable({
  providedIn: 'root'
})
export class ImportFormService extends BaseService {
  public doImport(endpoint: string, data: any, serviceName?: string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    this.requestOptions.data = data;
    const url = UrlConstant.API_VERSION + endpoint;
    return this.post(url, this.requestOptions);
  }

  public downloadTemplate(endpoint: string, serviceName: string) {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    const url = UrlConstant.API_VERSION + endpoint;
    return this.getRequestFile(url, this.requestOptions);
  }

  public doDownloadFileByName(fileName: any, serviceName?: string) {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    const url = UrlConstant.API_VERSION + '/download/temp-file?fileName=' + fileName;
    return this.getRequestFile(url, this.requestOptions);
  }
}

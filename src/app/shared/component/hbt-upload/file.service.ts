import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '@core/services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class FileService extends BaseService {
  deleteFile(url: string, params, serviceName?: string): Observable<any> {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    this.requestOptions.params = params;
    return this.delete(url, this.requestOptions);
  }

  doDownloadAttachFileWithSecurity(url: string, params, serviceName?: string) {
    this.resetRequest();
    this.requestOptions.serviceName = serviceName;
    this.requestOptions.params = params;
    return this.getRequestFile(url, this.requestOptions);
  }
}
import { Injectable } from '@angular/core';
import {BaseService} from "@core/services/base/base.service";
import {UrlConstant} from "@app/modules/hrm/data-access/constant/url.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";


@Injectable({
  providedIn: "root"
})
export class DownloadFileAttachService extends BaseService{
  readonly baseUrl = UrlConstant.API_VERSION + UrlConstant.DOWNLOAD_FILE_ATTACH;
  readonly serviceName = MICRO_SERVICE.ADMIN;

  // dowload file attach by docId
  doDownloadAttachFile(docId: string) {
    const url = this.baseUrl + `${docId}`;
    this.requestOptions.serviceName = this.serviceName;
    return this.getRequestFile(url , this.requestOptions);
  }

  doDownloadAttachFileWithSecurity(docId: string, security: string | any) {
    const url = this.baseUrl + `${docId}&security=${security}`;
    this.requestOptions.serviceName = this.serviceName;
    return this.getRequestFile(url, this.requestOptions);
  }
}

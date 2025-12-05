import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '@shared/services/auth.service';
import { STORAGE_NAME } from '@core/constant/system.constants';
import { SpinnerService } from '@shared/services/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { PreviewFileService } from '@shared/component/preview-file/preview-file.service';
import { getTypeExport } from '@shared/utils/import-utils.class';
import { saveAs } from 'file-saver';
import { StorageService } from '@core/services/storage.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  apiLastTime: number;
  TOKEN_HEADER_KEY = 'Authorization';

  constructor(private router: Router,
              private auth: AuthService,
              private readonly i18n: NzI18nService,
              private spinnerService: SpinnerService,
              private previewFileService: PreviewFileService,
              private toastService: ToastrService
  ) {
    // if (this.auth.isAuthenticated()) {
    //   this.auth.refreshToken();
    // }
    const timeoutSession = 15 * 60 * 1000;
    setInterval(() => {
      const now = new Date().valueOf();
      if (this.apiLastTime && now - this.apiLastTime > timeoutSession) {
        this.auth.logout();
      }
    }, 10000);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = StorageService.get(STORAGE_NAME.ACCESS_TOKEN);
    if (accessToken && !req.url.toLowerCase().includes('login') && !req.url.toLowerCase().includes('refresh-token')) {
      req = this.addTokenHeader(req, accessToken);
    }
    req = req.clone({ headers: req.headers.set('Accept-Language', this.i18n.getLocale().locale) });
    req = req.clone({ headers: req.headers.set('clientMessageId', uuidv4()) });
    const ignoreLoadingBar = req.headers.get('ignoreLoadingBar');
    if (!ignoreLoadingBar) {
      this.spinnerService.requestStart();
    }
    return next.handle(req).pipe(
      tap(res => {
        if (res instanceof HttpResponse) {
          this.spinnerService.requestEnd();
          if (res.body?.code && res.body?.code !== 'SUCCESS' && res.body?.message) {
            this.toastService.error(res.body?.message);
          }
          if (res.headers.get('Content-Disposition') && res.headers.get('Content-Disposition').includes('attachment') && !req.params.has('isNotAutoPreview')) {
            const fileName = res.headers.get('fileDownload');
            const serviceName = req.headers.get('serviceName');
            if (res.headers.get('isPreview') === 'true') {
              this.previewFileService.showModalViewFile(serviceName, res.body, fileName, res.headers.get('isPdf') === 'true', res.headers.get('isImage') === 'true');
            } else {
              const reportFile = new Blob([res.body], { type: getTypeExport(fileName.split('.').pop()) });
              saveAs(reportFile, fileName);
            }
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.spinnerService.requestEnd();
        let messageError = 'Đã có lỗi xảy ra. Vui lòng thử lai sau!';
        if (error.status === 403) {
          this.router.navigateByUrl('/unauthorized').then();
        } else if (error.status === 400) {
          if (error.error instanceof Blob) {
            const reader = new FileReader();
            reader.onload = () => {
              const jsonString = reader.result as any;
              const jsonObject = JSON.parse(jsonString);
              this.toastService.error(jsonObject?.message ?? messageError);
              return throwError(jsonObject);
            };
            reader.readAsText(error.error);
          } else {
            messageError = error.error?.message ? error.error?.message : messageError;
            this.toastService.error(messageError);
          }
        } else if (error.status === 500) {
          this.toastService.error(messageError);
        }
        if (req.responseType !== 'blob') {
          return throwError(error);
        }
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, accessToken: string) {
    /* for Spring Boot back-end */
    return request.clone({ headers: request.headers.set(this.TOKEN_HEADER_KEY, 'Bearer ' + accessToken) });
  }

  private clearTokenHeader(request: HttpRequest<any>) {
    /* for Spring Boot back-end */
    return request.clone({ headers: request.headers.delete(this.TOKEN_HEADER_KEY) });
  }
}

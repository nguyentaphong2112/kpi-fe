import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import {BaseCrudService} from "@core/services/base/base-crud.service";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {UrlConstant} from "@app/modules/abs/data-access/constant/url.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {RequestLeave} from "@app/modules/abs/data-access/models/request-leave";
import {BaseResponse} from "@shared/data-access";


@Injectable({
  providedIn: 'root'
})
export class RequestService extends BaseCrudService<NzSafeAny> {
  readonly urlEndpoint = UrlConstant.API_VERSION + UrlConstant.REQUEST_PATH;
  readonly serviceName = MICRO_SERVICE.ABS;

  search(formSearch: RequestLeave) {
    // const url = this.baseUrl + "/admin/search" + `/${formSearch.leaveType}`;
    // return this.get(url, { params: this._parseOptions(formSearch)  }, MICRO_SERVICE.ABS_MANAGEMENT);

      this.resetRequest();
      const url = this.urlEndpoint + "/admin/search" + `/${formSearch.leaveType}`;
      this.requestOptions.serviceName = this.serviceName;
      this.requestOptions.params = this._parseOptions(formSearch);
      return this.get(url, this.requestOptions);
  }

  // deleteById(id: number) {
  //   return this.delete(`${this.baseUrl}/admin/${id}`, {}, MICRO_SERVICE.ABS_MANAGEMENT);
  // }
  //
  findById(id: number) {
    this.resetRequest();
    const url = this.urlEndpoint + "/admin"+`/${id}`;
    this.requestOptions.serviceName = this.serviceName
    return  this.get(url,this.requestOptions);
  }

  //
  // saveOrUpdate(form: Request) {
  //   return this.post(this.baseUrl, form, {}, MICRO_SERVICE.ABS_MANAGEMENT)
  // }
  //
  // saveOrUpdateFormData(form: Request) {
  //   let formData = new FormData();
  //   formData.append("data", new Blob([JSON.stringify(form)], {
  //     type: 'application/json',
  //   }));
  //
  //   form.files?.forEach((nzFile: File) => {
  //     formData.append('files', nzFile)
  //   });
  //
  //   return this.post(`${this.baseUrl}/admin`, formData, {}, MICRO_SERVICE.ABS_MANAGEMENT)
  // }

  saveOrUpdateRequestLeave(form: any) {
    this.resetRequest();
    let formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(form)], {
      type: 'application/json',
    }));

    form.files?.forEach((nzFile: File) => {
      formData.append('files', nzFile)
    });
    const url = `${this.urlEndpoint}/admin/leave-save`;
    this.requestOptions.serviceName = MICRO_SERVICE.ABS_MANAGEMENT;
    return this.post(url, this.requestOptions);
  }
  //
  // export(formSearch: RequestLeave) {
  //   const url = this.baseUrl + "/export";
  //   return this.getRequestFileD2T(url, { params: CommonUtils.buildParams(formSearch) }, MICRO_SERVICE.ABS_MANAGEMENT);
  // }
  //
  // downloadFileTemplate(leaveType: string) {
  //   const url = this.baseUrl + "/get-template-import" + `/${leaveType}`;
  //   return this.getRequestFileD2T(url, {}, MICRO_SERVICE.ABS_MANAGEMENT);
  // }
  //
  // import(form: FormData) {
  //   const url = this.baseUrl + "/import";
  //   return this.post(url, form, {}, MICRO_SERVICE.ABS_MANAGEMENT)
  // }
  //
  getUserLogin(): Observable<BaseResponse> {
    this.resetRequest();
    const url = this.urlEndpoint + "/emp-info";
    this.requestOptions.serviceName = MICRO_SERVICE.ABS_MANAGEMENT;
    return this.get(url , this.requestOptions);
  }

    public getTotalRequestBackdate(leaveType: string) {
        this.resetRequest();
        this.requestOptions.params = { leaveType };
        this.requestOptions.serviceName = MICRO_SERVICE.ABS_MANAGEMENT;
        const url = `${this.urlEndpoint}/backdate/count`;
        return this.get(url, this.requestOptions);
    }

  //
  // approveBackdateRequests(requestId: number) {
  //   const payload: Request = {
  //     requestId
  //   };
  //   const url = `${this.baseUrl}/action/approveBackdate`;
  //   return this.post(url, payload, { }, MICRO_SERVICE.ABS_MANAGEMENT);
  // }

  _parseOptions(formData: RequestLeave) {
    let params = new HttpParams();
    if (!formData) {
        return params;
    }
    for (const [key, value] of Object.entries(formData)) {
        if(value) {
            params = params.set(key, value + '');
        }
    }
    return params;
  }
}

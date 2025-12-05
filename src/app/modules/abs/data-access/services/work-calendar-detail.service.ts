import {Injectable} from '@angular/core';
import {UrlConstant} from "@app/modules/abs/data-access/constant/url.class";
import {Observable} from "rxjs";
import {BaseResponse} from "@shared/data-access";
import {CommonUtils} from "@shared/services/common-utils.service";
import {WorkCalendarDetails} from "@app/modules/abs/data-access/models/work-calendar-details";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {BaseCrudService} from "@core/services/base/base-crud.service";
import {NzSafeAny} from "ng-zorro-antd/core/types";

@Injectable({
    providedIn: 'root'
})
export class WorkCalendarDetailService extends BaseCrudService<NzSafeAny> {
    protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.WORK_CALENDAR_DETAIL.PREFIX;
    protected override serviceName = MICRO_SERVICE.ABS;

    // Lấy danh sách
    public search(searchData: WorkCalendarDetails): Observable<BaseResponse> {
      const params = CommonUtils.buildParams(searchData);
      this.resetRequest();
      const url = this.urlEndpoint;
      this.requestOptions.serviceName = this.serviceName;
      this.requestOptions.params = params;
      return this.get(url, this.requestOptions);
    }
    //
    // // Lưu bản ghi
    // public saveRecord(request: WorkCalendarDetails) {
    //     const url = this.baseUrl;
    //     return this.post(url, request, {}, MICRO_SERVICE.ABS_MANAGEMENT);
    // }
    //
    //
    // // Xóa bản ghi
    // public deleteRecord(workCalendarDetailId: number) {
    //     const url = this.baseUrl + UrlConstant.WORK_CALENDAR.DELETE.replace('{workCalendarDetailId}', workCalendarDetailId.toString())
    //     return this.delete(url, {}, MICRO_SERVICE.ABS_MANAGEMENT);
    // }
    //
    // // Lấy bản ghi
    // public getRecord(workCalendarDetailId: number) {
    //     const url = this.baseUrl + UrlConstant.WORK_CALENDAR.DETAIL.replace('{workCalendarDetailId}', workCalendarDetailId.toString())
    //     return this.get(url, {}, MICRO_SERVICE.ABS_MANAGEMENT);
    // }
    // /**
    //  * downloadFileTemplate
    //  * @returns
    //  */
    // public downloadFileTemplate() {
    //     const url = this.baseUrl + "/get-template-import";
    //     return this.getRequestFileD2T(url, {}, MICRO_SERVICE.ABS_MANAGEMENT);
    // }
    //
    // /**
    //  * Thực hiện import
    //  * @param form
    //  */
    // import(form: FormData) {
    //   const url = this.baseUrl + "/import";
    //   return this.post(url, form, {}, MICRO_SERVICE.ABS_MANAGEMENT)
    // }
}

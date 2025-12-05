import { Injectable } from '@angular/core';
import {BaseService} from "@core/services/base/base.service";
import {UrlConstant} from "@app/modules/abs/data-access/constant/url.class";
import {BaseCrudService} from "@core/services/base/base-crud.service";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {WorkCalendars} from "@app/modules/abs/data-access/models/work-calendars";

@Injectable({
    providedIn: 'root'
})
export class WorkCalendarService extends BaseCrudService<NzSafeAny> {
    readonly urlEndpoint = UrlConstant.API_VERSION + UrlConstant.WORK_CALENDAR.PREFIX;
    readonly serviceName = MICRO_SERVICE.ABS;

    // // Lấy danh sách
    // public search(searchData: WorkCalendars): Observable<BaseResponse> {
    //     const params = CommonUtils.buildParams(searchData);
    //     const url = this.baseUrl;
    //     return this.get(url, { params: params }, MICRO_SERVICE.ABS_MANAGEMENT);
    // }

    // Lưu bản ghi
    public saveRecord(request: WorkCalendars) {
      this.resetRequest();
      const url = this.urlEndpoint;
      this.requestOptions.serviceName = this.serviceName;

      return this.post(url, this.requestOptions);
    }


    // // Xóa bản ghi
    // public deleteRecord(workCalendarId: number) {
    //     const url = this.baseUrl + UrlConstant.WORK_CALENDAR.DELETE.replace('{workCalendarId}', workCalendarId.toString())
    //     return this.delete(url, {}, MICRO_SERVICE.ABS_MANAGEMENT);
    // }
    //
    // Lấy bản ghi
    public getRecord(workCalendarId: number | any) {
      this.resetRequest();
      const url = this.urlEndpoint + UrlConstant.WORK_CALENDAR.DETAIL.replace('{workCalendarId}', workCalendarId.toString())
      this.requestOptions.serviceName = this.serviceName;

      return this.get(url,this.requestOptions);
    }

    // Lấy danh sách lịch làm việc còn hiệu lực
    public getActiveWorkCalendars() {
      this.resetRequest();
      const url = this.urlEndpoint + UrlConstant.WORK_CALENDAR.ALL_ACTIVE;
      this.requestOptions.serviceName = this.serviceName;

      return this.get(url,this.requestOptions);
    }

    // // Gán lịch làm việc
    // public assignWorkCalendar(workCalendarId: number, request: WorkCalendars) {
    //     const url = this.baseUrl + UrlConstant.WORK_CALENDAR.ASSIGN.replace('{workCalendarId}', workCalendarId.toString())
    //     return this.post(url, request, {}, MICRO_SERVICE.ABS_MANAGEMENT);
    // }
}

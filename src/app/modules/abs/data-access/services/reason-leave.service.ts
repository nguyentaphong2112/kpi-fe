import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {BaseCrudService} from "@core/services/base/base-crud.service";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant} from "@app/modules/abs/data-access/constant/url.class";

@Injectable({
    providedIn: 'root'
})
export class ReasonLeaveService extends BaseCrudService<NzSafeAny> {
    readonly baseUrl = UrlConstant.API_VERSION + UrlConstant.REASON_LEAVE.PREFIX;
    readonly serviceName = MICRO_SERVICE.ABS;

  //   // Lấy danh sách
  //   public search(searchData: ReasonLeave): Observable<BaseResponse> {
  //       const params = CommonUtils.buildParams(searchData);
  //       const url = this.baseUrl;
  //       return this.get(url, { params: params }, MICRO_SERVICE.ABS_MANAGEMENT);
  //   }
  //
  //   // Lưu bản ghi
  //   public saveRecord(request: ReasonLeave) {
  //       const url = this.baseUrl;
  //       return this.post(url, request, {}, MICRO_SERVICE.ABS_MANAGEMENT);
  //   }
  //
  //   // Xóa bản ghi
  //   public deleteRecord(reasonLeaveId: number) {
  //       const url = this.baseUrl + UrlConstant.REASON_LEAVE.DELETE.replace('{reasonLeaveId}', reasonLeaveId.toString())
  //       return this.delete(url, {}, MICRO_SERVICE.ABS_MANAGEMENT);
  //   }
  //
  //   // Lấy bản ghi
  //   public getRecord(reasonLeaveId: number | any) {
  //       const url = this.baseUrl + UrlConstant.REASON_LEAVE.DETAIL.replace('{reasonLeaveId}', reasonLeaveId.toString())
  //       return this.get(url, {}, MICRO_SERVICE.ABS_MANAGEMENT);
  //   }
  //
  //   // Lấy thông tin workday-type ký hiệu chấm công
  //   public getAllWorkDayType() {
  //     const url = UrlConstant.API_VERSION + "/workday-type/get-all";
  //     return this.get(url, {}, MICRO_SERVICE.ABS_MANAGEMENT);
  // }

    public getAllReasonLeaves(groupCode: string) {
        this.resetRequest();
        this.requestOptions.params = { groupCode };
        this.requestOptions.serviceName = MICRO_SERVICE.ABS_MANAGEMENT;
        const url = UrlConstant.API_VERSION + UrlConstant.REASON_LEAVE.PREFIX + `/all`;
        return this.get(url, this.requestOptions);
    }

}

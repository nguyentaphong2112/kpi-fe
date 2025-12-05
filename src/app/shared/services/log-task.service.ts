import { Injectable } from '@angular/core';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable } from 'rxjs';
import { BaseResponse } from '@core/models/base-response';

@Injectable({
  providedIn: 'root'
})
export class LogTaskService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.HRM;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.LOG_TASK.PREFIX;

  public updateData(data: any, id: number): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.data = data;

    const url = (UrlConstant.API_VERSION + UrlConstant.LOG_TASK.UPDATE)
      .replace('{id}', id.toString());

    return this.put(url, this.requestOptions);
  }

}

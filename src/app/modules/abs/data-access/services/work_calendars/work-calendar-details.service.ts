import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { WorkCalendarDetailsModel } from '../../models/work_calendars/work-calendar-details.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class WorkCalendarDetailsService extends BaseCrudService<WorkCalendarDetailsModel> {
  protected override serviceName = MICRO_SERVICE.ABS;
  protected override urlEndpoint = '/v1/work-calendar-details';

  public downloadFileTemplate() {
    this.resetRequest();
    const url = this.urlEndpoint + "/download-template";
    this.requestOptions.serviceName = this.serviceName;
    return this.getRequestFile(url, this.requestOptions);
  }

  import(form: FormData) {
    this.resetRequest();
    const url = this.urlEndpoint + "/import";
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.data = form;
    return this.post(url, this.requestOptions);
  }
}



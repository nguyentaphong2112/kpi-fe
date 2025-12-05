import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { WorkCalendarsModel } from '../../models/work_calendars/work-calendars.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant} from "@app/modules/abs/data-access/constant/url.class";

@Injectable({
  providedIn: 'root'
})
export class WorkCalendarsService extends BaseCrudService<WorkCalendarsModel> {
  protected override serviceName = MICRO_SERVICE.ABS;
  protected override urlEndpoint = '/v1/work-calendars';

  public getRecord(workCalendarId: number | any) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.WORK_CALENDAR.DETAIL.replace('{workCalendarId}', workCalendarId.toString());
    this.requestOptions.serviceName = this.serviceName;
    return this.get(url,this.requestOptions);
  }
}



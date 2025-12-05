import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { DutySchedulesModel } from '@app/modules/abs/data-access/models/duty-schedule-manager/duty-schedules.model';
import { MICRO_SERVICE } from '@core/constant/system.constants';

@Injectable({
  providedIn: 'root'
})
export class DutyScheduleMonthService extends BaseCrudService<DutySchedulesModel> {
  protected override serviceName = MICRO_SERVICE.ABS;
  protected override urlEndpoint = '/v1/duty-schedule-month';
}

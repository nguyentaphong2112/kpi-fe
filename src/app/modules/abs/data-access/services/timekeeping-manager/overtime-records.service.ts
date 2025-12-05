import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { OvertimeRecordsModel } from '../../models/timekeeping-manager/overtime-records.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";

@Injectable({
  providedIn: 'root'
})
export class OvertimeRecordsService extends BaseCrudService<OvertimeRecordsModel> {
  protected override serviceName = MICRO_SERVICE.ABS;
  protected override urlEndpoint = '/v1/overtime-records';
}



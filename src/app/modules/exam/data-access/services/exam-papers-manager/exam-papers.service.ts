import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { SessionsModel } from '../../models/sessions-manager/sessions.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Injectable({
  providedIn: 'root'
})
export class ExamPapersService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.EXAM;
  protected override urlEndpoint = '/v1/exam-papers';
}



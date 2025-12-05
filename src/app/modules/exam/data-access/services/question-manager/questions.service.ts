import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { QuestionsModel } from '../../models/question-manager/questions.model';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import { Observable } from 'rxjs';
import { BaseResponse } from '@core/models/base-response';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService extends BaseCrudService<QuestionsModel> {
  protected override serviceName = MICRO_SERVICE.EXAM;
  protected override urlEndpoint = '/v1/questions';

  searchData(payload: Record<string, any>, urlAfter?: string) {
    this.loadingData = true;
    this.resetRequest();
    this.requestOptions.data = payload;
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.cacheGetRequest = false;
    return this.get(`${this.urlEndpoint}` + (urlAfter ?? ''), this.requestOptions)
  }


}



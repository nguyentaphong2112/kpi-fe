import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { MICRO_SERVICE } from '@core/constant/system.constants';

@Injectable({
  providedIn: 'root'
})
export class FeedbacksService extends BaseCrudService<NzSafeAny> {

  private URL = '/v1/user/feedbacks';

  protected override serviceName = MICRO_SERVICE.ADMIN;
  protected override urlEndpoint = this.URL;
}


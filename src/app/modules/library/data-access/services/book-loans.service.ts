import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/library/data-access/constants/url.constant';

@Injectable({
  providedIn: 'root'
})
export class BookLoansService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.LIBRARY;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.BOOK_LOANS.GET_BOOK_LOANS;


  updateBorrow(data: any, urlAfter?: string) {
    this.resetRequest();
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '');
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.data = data;
    return this.put(url, this.requestOptions);
  }

}

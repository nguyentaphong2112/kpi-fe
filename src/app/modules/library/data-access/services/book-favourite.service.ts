import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { Books } from '@app/modules/library/data-access/models/books.model';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/library/data-access/constants/url.constant';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Injectable({
  providedIn: 'root'
})
export class BookFavouriteService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.LIBRARY;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.BOOK_FAVOURITE.GET_BOOK_FAVOURITE;
}

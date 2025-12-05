import { Injectable } from '@angular/core';
import { UrlConstant } from '../../constant/url.class';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { BaseService } from '@core/services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class BookmarkFormService extends BaseService {
  serviceName = MICRO_SERVICE.ADMIN;

  public getBookmark(bookmarkType: string) {
    this.resetRequest();
    this.requestOptions.params = {bookmarkType};
    this.requestOptions.serviceName = this.serviceName;
    const url = UrlConstant.API_VERSION + UrlConstant.USER_BOOKMARK.GET_BY_USER;
    return this.get(url, this.requestOptions);
  }

  public createBookmark(data: any) {
    this.resetRequest();
    this.requestOptions.data = data;
    this.requestOptions.serviceName = this.serviceName;
    const url = UrlConstant.API_VERSION + UrlConstant.USER_BOOKMARK.PREFIX;
    return this.post(url, this.requestOptions);
  }

  public upDateBookmark(data: any) {
    this.resetRequest();
    this.requestOptions.data = data;
    this.requestOptions.serviceName = this.serviceName;
    const url = UrlConstant.API_VERSION + UrlConstant.USER_BOOKMARK.PREFIX + `/${data.userBookmarkId}`;
    return this.put(url, this.requestOptions);
  }

  public deleteBookmark(id: number | any) {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    const url = UrlConstant.API_VERSION + UrlConstant.USER_BOOKMARK.DELETE_BOOKMARK.replace('{id}', id.toString());
    return this.delete(url, this.requestOptions);
  }
}

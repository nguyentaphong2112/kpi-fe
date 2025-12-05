import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base/base-crud.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@shared/constant/url.class';

@Injectable({
  providedIn: 'root'
})
export class PrintsService extends BaseCrudService<any> {

  protected override serviceName = MICRO_SERVICE.ADMIN;
  protected override urlEndpoint = '/v1/card-templates';

  public getListTitleCardTemplate(templateType: string) {
    this.resetRequest();
    const url = this.urlEndpoint + UrlConstant.CARD_TEMPLATES.TITLE + `/${templateType}`;
    this.requestOptions.serviceName = this.serviceName;
    return this.get(url, this.requestOptions);
  }

  public getFileByAttachmentId(attachmentId: number) {
    this.resetRequest();
    const url =  this.urlEndpoint + UrlConstant.CARD_TEMPLATES.FILE + `/${attachmentId}`;
    this.requestOptions.serviceName = this.serviceName;
    return this.get(url, this.requestOptions);
  }

  public getDataByCardTemplateId(cardTemplateId: number) {
    this.resetRequest();
    const url= this.urlEndpoint + `/${cardTemplateId}`;
    this.requestOptions.serviceName = this.serviceName;
    return this.get(url, this.requestOptions);
  }

}



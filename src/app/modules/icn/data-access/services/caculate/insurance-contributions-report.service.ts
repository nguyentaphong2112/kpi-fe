import {Injectable} from "@angular/core";
import {BaseCrudService} from "@core/services/base/base-crud.service";
import {InsuranceContributionsModel} from "@app/modules/icn/data-access/models/caculate/insurance-contributions.model";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {Observable} from "rxjs";
import {BaseResponse} from "@core/models/base-response";

@Injectable({
  providedIn: 'root'
})
export class IcnContributionsReportService extends BaseCrudService<any> {
  protected override serviceName = MICRO_SERVICE.ICN;
  protected override urlEndpoint = '/v1/insurance-contributions-report';

  override export(searchParam: any, urlAfter?: string, isPost?: boolean, paramPost?: any, responseType?: string): Observable<BaseResponse<any>> {
    this.resetRequest();
    this.requestOptions.serviceName = this.serviceName;
    this.requestOptions.responseType = responseType ?? 'blob';
    const url = this.urlEndpoint + (urlAfter ? urlAfter : '');
    if (isPost) {
      this.requestOptions.data = searchParam;
      this.requestOptions.params = paramPost;
      return this.postRequestFile(url, this.requestOptions);
    } else {
      this.requestOptions.params = searchParam;
      return this.getRequestFile(url, this.requestOptions);
    }
  }
}
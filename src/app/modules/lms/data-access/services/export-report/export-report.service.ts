import {Injectable} from "@angular/core";
import {BaseCrudService} from "@core/services/base/base-crud.service";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import { UrlConstant } from '@app/modules/lms/data-access/constants/url.constant';


@Injectable({
  providedIn: 'root'
})
export class ExportReportService extends BaseCrudService<NzSafeAny> {
  protected override serviceName = MICRO_SERVICE.LMS;
  protected override urlEndpoint = UrlConstant.API_VERSION + UrlConstant.EXPORT_REPORT.PREFIX;
}
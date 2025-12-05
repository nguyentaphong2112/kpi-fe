import {Component, Injector, OnInit} from '@angular/core';
import {BaseListComponent} from "@core/components/base-list.component";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {ActionSchema} from "@core/models/action.model";
import {CommonUtils} from "@shared/services/common-utils.service";
import {Scopes} from "@core/utils/common-constants";
import {Validators} from "@angular/forms";
import {UrlConstant} from "@app/modules/abs/data-access/constant/url.class";
import {TaxReportService} from "@app/modules/pit/data-access/services/report/tax-report.service";
import {ReportModel} from "@app/modules/pit/data-access/models/report/tax-settlement-masters.model";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";

@Component({
  selector: 'app-trt-index',
  templateUrl: './trt-index.component.html',
  styleUrls: ['./trt-index.component.scss']
})
export class TrtIndexComponent extends BaseListComponent<ReportModel> implements OnInit {
  serviceName = MICRO_SERVICE.PIT;
  urlLoadData = '/tax-report';
  urlConstantShare = UrlConstantShare;
  scope: string = Scopes.VIEW;
  urlConstant = UrlConstant;


  constructor(
    injector: Injector,
    private readonly service: TaxReportService,
  ) {
    super(injector);
    this.exportApi = (body) => this.service.exportDetail(CommonUtils.convertDataSendToServer(body, true));
    this.isCustomSearch = true;
    this.initFormSearch();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  initFormSearch() {
    this.form = this.fb.group({
      reportType: [null, [Validators.required]],
      orgIds: [null],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
    }, {
      validators: [
        DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')
      ]
    });
  }

}

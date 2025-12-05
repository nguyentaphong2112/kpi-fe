import {Component, Injector, OnInit} from '@angular/core';
import {CategoryModel} from "@core/models/category-common.interface";
import {Scopes} from "@core/utils/common-constants";
import {FunctionCode} from "@shared/enums/enums-constant";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {ExportReportService} from "@app/modules/crm/data-access/services/export-report/export-report.service";
import {Validators} from "@angular/forms";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {ObjectUtil} from "@core/utils/object.util";

import {format} from "date-fns";
import {BaseListComponent} from "@core/components/base-list.component";
import {CATEGORY_CODE} from "@shared/constant/common";
import {Constant} from "@app/modules/icn/data-access/constants/constant";
import {
  IcnContributionsReportService
} from "@app/modules/icn/data-access/services/caculate/insurance-contributions-report.service";
import {CommonUtils} from "@shared/services/common-utils.service";

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss']
})
export class ReportViewComponent extends BaseListComponent<any> implements OnInit {



  listReportPeriodType = ObjectUtil.optionsToList(Constant.ListReportPeriodType)
  listReportQuarter = ObjectUtil.optionsToList(Constant.ListReportQuarter)
  scope: string = Scopes.VIEW;
  functionCode = FunctionCode.INSURANCE_CONTRIBUTIONS_REPORT;
  serviceName = MICRO_SERVICE.CRM;


  constructor(injector: Injector,
              private service: IcnContributionsReportService) {
    super(injector);
    this.exportApi = (params: any) => this.service.export(params, '/' + this.form.get('reportType').value);
    this.isCustomSearch = true;
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      reportType: [null, Validators.required],
      periodType: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      quarter: [null],
      year: [null],
      listLocationJoin: [null],
      listStatus: [null],
      format: [null],
    }, {
      validators: [
        DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')
      ]
    });
  }


  beforeExport() {
    const formValue = CommonUtils.convertDataSendToServer(this.form.value);
    formValue.startYear = this.form.value.startDate?.getFullYear();
    formValue.endYear = this.form.value.endDate?.getFullYear();
    if (Array.isArray(formValue.listLocationJoin)) {
      formValue.listLocationJoin = formValue.listLocationJoin.join(',');
    }

    if (Array.isArray(formValue.listStatus)) {
      formValue.listStatus = formValue.listStatus.join(',');
    }
    this.params = {
      ...formValue
    };

  }

  changeReportPeriodType(event: any) {
    if (event === 'QUARTER') {
      this.form.get('quarter').setValidators(Validators.compose([Validators.required]));
      this.form.get('year').setValidators(Validators.compose([Validators.required]));
      this.form.get('startDate').clearValidators();
      this.form.get('startDate').setErrors(null);
      this.form.get('endDate').clearValidators();
      this.form.get('endDate').setErrors(null);
    } else {
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() - 1);
      this.form.get('startDate').setValue(currentDate);
      this.form.get('endDate').setValue(currentDate);
      this.form.get('startDate').setValidators(Validators.compose([Validators.required]));
      this.form.get('endDate').setValidators(Validators.compose([Validators.required]));
      this.form.get('quarter').clearValidators();
      this.form.get('quarter').setErrors(null);
      this.form.get('year').clearValidators();
      this.form.get('year').setErrors(null);
    }
  }

  protected readonly CATEGORY_CODE = CATEGORY_CODE;
  protected readonly MICRO_SERVICE = MICRO_SERVICE;
}

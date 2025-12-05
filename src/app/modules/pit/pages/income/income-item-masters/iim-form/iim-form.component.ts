import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {IncomeItemMastersModel} from "../../../../data-access/models/income/income-item-masters.model";
import {IncomeItemMastersService} from "../../../../data-access/services/income/income-item-masters.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {format} from "date-fns";

@Component({
  selector: 'iim-form',
  templateUrl: './iim-form.component.html',
  styleUrls: ['./iim-form.component.scss']
})
export class IimFormComponent extends BaseFormComponent<IncomeItemMastersModel> implements OnInit {

  serviceName = MICRO_SERVICE.PIT
  urlLoadData = '/income-item-masters'
  constructor(
    private readonly service: IncomeItemMastersService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'incomeItemMasterId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: IncomeItemMastersModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: IncomeItemMastersModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      incomeItemMasterId: [null],
      incomeItemId: [null, [Validators.required]],
      taxPeriodDate: [null, [Validators.required]],
      isTaxCalculated: [null, [Validators.required]],
      status: [null, [Validators.required, Validators.maxLength(20)]],
      inputTimes: [null, [Validators.required]],
      totalIncome: [null, [Validators.required]],
      totalInsuranceDeduction: [null, [Validators.required]],
      totalOtherDeduction: [null, [Validators.required]],
      totalIncomeTaxable: [null, [Validators.required]],
      totalIncomeFreeTax: [null, [Validators.required]],
      totalIncomeTax: [null, [Validators.required]],
      totalMonthRetroTax: [null, [Validators.required]],
      totalYearRetroTax: [null, [Validators.required]],
      totalReceived: [null, [Validators.required]],
      taxCalBy: [null, [Validators.required, Validators.maxLength(50)]],
      taxDate: [null, [Validators.required]],
      fileList: [null]

    },
    {validators:
        []
    });
  }
}



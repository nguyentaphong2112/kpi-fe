import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {TaxDeclareMastersModel} from "../../../../data-access/models/declare/tax-declare-masters.model";
import {TaxDeclareMastersService} from "../../../../data-access/services/declare/tax-declare-masters.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";

@Component({
  selector: 'tdm-form',
  templateUrl: './tdm-form.component.html',
  styleUrls: ['./tdm-form.component.scss']
})
export class TdmFormComponent extends BaseFormComponent<TaxDeclareMastersModel> implements OnInit {

  serviceName = MICRO_SERVICE.PIT
  urlLoadData = '/tax-declare-masters'
  constructor(
    private readonly service: TaxDeclareMastersService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = false;
    this.key = 'taxDeclareMasterId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: TaxDeclareMastersModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: TaxDeclareMastersModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      taxDeclareMasterId: [null],
      taxPeriodDate: [null, [Validators.required]],
      totalIncomeTaxable: [null, [Validators.required]],
      totalIncomeFreeTax: [null, [Validators.required]],
      totalInsuranceDeduction: [null, [Validators.required]],
      totalOtherDeduction: [null, [Validators.required]],
      totalIncomeTax: [null, [Validators.required]],
      totalTaxCollected: [null, [Validators.required]],
      totalTaxPayable: [null, [Validators.required]],
      totalMonthRetroTax: [null, [Validators.required]],
      totalTaxpayers: [null, [Validators.required]],
      status: [null, [Validators.required, Validators.maxLength(255)]],
      inputType: [null, [Validators.required]],
      incomeItemMasterIds: [null, [Validators.required, Validators.maxLength(1000)]],
      fileList: [null]

    },
    {validators:
        []
    });
  }
}



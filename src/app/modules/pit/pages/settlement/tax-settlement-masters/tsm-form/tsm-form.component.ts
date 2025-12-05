import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {TaxSettlementMastersModel} from "../../../../data-access/models/settlement/tax-settlement-masters.model";
import {TaxSettlementMastersService} from "../../../../data-access/services/settlement/tax-settlement-masters.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";

@Component({
  selector: 'tsm-form',
  templateUrl: './tsm-form.component.html',
  styleUrls: ['./tsm-form.component.scss']
})
export class TsmFormComponent extends BaseFormComponent<TaxSettlementMastersModel> implements OnInit {

  serviceName = MICRO_SERVICE.PIT
  urlLoadData = '/tax-settlement-masters'
  constructor(
    private readonly service: TaxSettlementMastersService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = false;
    this.key = 'taxSettlementMasterId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: TaxSettlementMastersModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: TaxSettlementMastersModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      taxSettlementMasterId: [null],
      year: [null, [Validators.required]],
      inputType: [null, [Validators.required]],
      status: [null, [Validators.required]],
      taxDeclareMasterIds: [null, [Validators.required, Validators.maxLength(500)]],
      totalTaxpayers: [null, [Validators.required]],
      totalIncomeTaxable: [null, [Validators.required]],
      totalInsuranceDeduction: [null, [Validators.required]],
      totalTaxCollected: [null, [Validators.required]],
      fileList: [null]

    },
    {validators:
        []
    });
  }
}



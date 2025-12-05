import {Component, Injector, OnInit} from '@angular/core';
import {BaseFormComponent} from "@core/components/base-form.component";
import {TaxDeclareMastersModel} from "@app/modules/pit/data-access/models/declare/tax-declare-masters.model";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {TaxDeclareMastersService} from "@app/modules/pit/data-access/services/declare/tax-declare-masters.service";
import {CommonUtils} from "@shared/services/common-utils.service";
import {FormArray, FormGroup, Validators} from "@angular/forms";
import {TaxSettlementMastersModel} from "@app/modules/pit/data-access/models/settlement/tax-settlement-masters.model";
import {Constant} from "@app/modules/pit/data-access/constant/constant.class";
import {REQUEST_TYPE} from "@shared/constant/common";
import {
  TaxSettlementMastersService
} from "@app/modules/pit/data-access/services/settlement/tax-settlement-masters.service";

@Component({
  selector: 'app-tax-settlement-masters-synthetic',
  templateUrl: './tax-settlement-masters-synthetic.component.html',
  styleUrls: ['./tax-settlement-masters-synthetic.component.scss']
})
export class TaxSettlementMastersSyntheticComponent extends BaseFormComponent<TaxSettlementMastersModel> implements OnInit {
  serviceName = MICRO_SERVICE.PIT;
  urlLoadData = '/tax-settlement-masters';
  public listInputType: Array<{ id: string, name: string }> = Constant.SelectPitInputType;
  year: any;

  constructor(
    private readonly service: TaxSettlementMastersService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = false;
    this.key = 'taxSettlementMasterId'
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: any) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, `/calculate/${body.taxPeriodYear.getFullYear()}`);

  }

  override initForm() {
    this.form = this.fb.group({
      taxPeriodYear: [null, [Validators.required]],
      months: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.form.get('taxPeriodYear')?.valueChanges.subscribe((value) => {
      if (value) {
        this.generateMonths();
      }
    });
  }

  get months(): FormArray {
    return this.form.controls['months'] as FormArray;
  }

  generateMonths() {
    this.months.clear();
    for (let i = 1; i <= 12; i++) {
      this.months.push(this.createMonthForm(i));
    }
  }

  createMonthForm(month: number): FormGroup {
    return this.fb.group({
      month: [month],
      inputType: [null]
    });
  }
}

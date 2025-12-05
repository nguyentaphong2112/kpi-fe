import {Component, Injector, OnInit} from '@angular/core';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {TaxDeclareMastersService} from "@app/modules/pit/data-access/services/declare/tax-declare-masters.service";
import {TaxDeclareMastersModel} from "@app/modules/pit/data-access/models/declare/tax-declare-masters.model";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {Validators} from "@angular/forms";
import {BaseFormComponent} from "@core/components/base-form.component";

@Component({
  selector: 'app-calculate-declare',
  templateUrl: './calculate-declare.component.html',
  styleUrls: ['./calculate-declare.component.scss']
})
export class CalculateDeclareComponent extends BaseFormComponent<TaxDeclareMastersModel> implements OnInit {

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
    this.createApi = (body: TaxDeclareMastersModel) => this.service.calculator(CommonUtils.convertDataSendToServer(body));
  }

  override initForm() {
    this.form = this.fb.group({
        taxPeriodDate: [null, [Validators.required]],
      },
      {validators:
          []
      });
  }
}

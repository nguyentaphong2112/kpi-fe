import { Component, Injector, OnInit } from '@angular/core';
import { OrderPayablesModel } from '../../../../data-access/models/order-managers/order-payables.model';
import { OrderPayablesService } from '../../../../data-access/services/order-managers/order-payables.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';

@Component({
  selector: 'ops-form',
  templateUrl: './ops-form.component.html',
  styleUrls: ['./ops-form.component.scss']
})
export class OpsFormComponent extends BaseFormComponent<OrderPayablesModel> implements OnInit {

  constructor(
    private readonly service: OrderPayablesService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'orderPayableId';

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: OrderPayablesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: OrderPayablesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      orderPayableId: [null],
      referralFee: [null],
      careFee: [null],
      welfareFee: [null]

    });
  }
}



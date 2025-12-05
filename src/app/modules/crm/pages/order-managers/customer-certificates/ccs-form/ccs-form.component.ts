import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { CustomerCertificatesModel } from '../../../../data-access/models/order-managers/customer-certificates.model';
import {
  CustomerCertificatesService
} from '../../../../data-access/services/order-managers/customer-certificates.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';

@Component({
  selector: 'ccs-form',
  templateUrl: './ccs-form.component.html',
  styleUrls: ['./ccs-form.component.scss']
})
export class CcsFormComponent extends BaseFormComponent<CustomerCertificatesModel> implements OnInit {
  serviceName = MICRO_SERVICE.CRM;

  constructor(
    private readonly service: CustomerCertificatesService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'customerCertificateId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: CustomerCertificatesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: CustomerCertificatesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      customerCertificateId: [null],
      customerId: [null, [Validators.required]],
      certificateId: [null, [Validators.required]],
      issuedDate: [null, [Validators.required]],
      note: [null]

    });
  }
}



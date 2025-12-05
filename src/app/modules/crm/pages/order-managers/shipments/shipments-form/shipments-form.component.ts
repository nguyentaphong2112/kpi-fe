import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {ShipmentsModel} from "../../../../data-access/models/order-managers/shipments.model";
import {ShipmentsService} from "../../../../data-access/services/order-managers/shipments.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";

@Component({
  selector: 'shipments-form',
  templateUrl: './shipments-form.component.html',
  styleUrls: ['./shipments-form.component.scss']
})
export class ShipmentsFormComponent extends BaseFormComponent<ShipmentsModel> implements OnInit {

  serviceName = MICRO_SERVICE.CRM
  urlLoadData = '/shipments'
  constructor(
    private readonly service: ShipmentsService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'shipmentId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: ShipmentsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: ShipmentsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      shipmentId: [null],
      orderId: [null, [Validators.required]],
      shipperId: [null, [Validators.required, Validators.maxLength(20)]],
      shipmentDate: [null, [Validators.required]],
      trackingNo: [null, [Validators.required, Validators.maxLength(20)]],
      fileList: [null]

    },
    {validators:
        []
    });
  }
}



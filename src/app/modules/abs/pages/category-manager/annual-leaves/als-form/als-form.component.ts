import { Component, Injector, OnInit } from '@angular/core';
import { AnnualLeavesModel } from '../../../../data-access/models/category-manager/annual-leaves.model';
import { AnnualLeavesService } from '../../../../data-access/services/category-manager/annual-leaves.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';

@Component({
  selector: 'als-form',
  templateUrl: './als-form.component.html',
  styleUrls: ['./als-form.component.scss']
})
export class AlsFormComponent extends BaseFormComponent<AnnualLeavesModel> implements OnInit {

  constructor(
    private readonly service: AnnualLeavesService,
    injector: Injector
  ) {
    super(injector);

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: AnnualLeavesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: AnnualLeavesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  ngOnInit() {
  }
}



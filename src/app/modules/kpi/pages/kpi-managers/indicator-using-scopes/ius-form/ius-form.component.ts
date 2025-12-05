import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {IndicatorUsingScopesModel} from "../../../../data-access/models/kpi-managers/indicator-using-scopes.model";
import {IndicatorUsingScopesService} from "../../../../data-access/services/kpi-managers/indicator-using-scopes.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";

@Component({
  selector: 'ius-form',
  templateUrl: './ius-form.component.html',
  styleUrls: ['./ius-form.component.scss']
})
export class IusFormComponent extends BaseFormComponent<IndicatorUsingScopesModel> implements OnInit {

  serviceName = MICRO_SERVICE.KPI
  urlLoadData = '/indicator-using-scopes'
  constructor(
    private readonly service: IndicatorUsingScopesService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = ''

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: IndicatorUsingScopesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: IndicatorUsingScopesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
            indicatorUsingId: [null, [Validators.required]],
      indicatorId: [null, [Validators.required]],
      organizationId: [null, [Validators.required]],
      positionId: [null, [Validators.required]],
      jobId: [null, [Validators.required]],
      fileList: [null]

    },
    {validators:
        []
    });
  }
}



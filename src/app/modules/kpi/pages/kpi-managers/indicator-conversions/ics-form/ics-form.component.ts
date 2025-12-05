import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { IndicatorConversionsModel } from '../../../../data-access/models/kpi-managers/indicator-conversions.model';
import {
  IndicatorConversionsService
} from '../../../../data-access/services/kpi-managers/indicator-conversions.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { Scopes } from '@core/utils/common-constants';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { IndicatorMasterService } from '@app/modules/kpi/data-access/services/kpi-managers/indicator-master.service';

@Component({
  selector: 'ics-form',
  templateUrl: './ics-form.component.html',
  styleUrls: ['./ics-form.component.scss']
})
export class IcsFormComponent extends BaseFormComponent<IndicatorConversionsModel> implements OnInit {

  serviceName = MICRO_SERVICE.HRM;
  urlLoadData = UrlConstant.JOBS.VI_TRI_VIEC_LAM;
  scope = Scopes.VIEW;

  constructor(
    private readonly service: IndicatorConversionsService,
    private readonly masterService: IndicatorMasterService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'indicatorConversionId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: IndicatorConversionsModel) => this.masterService.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: IndicatorConversionsModel) => this.masterService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      orgTypeId: [null, [Validators.required]],
      organizationId: [1, [Validators.required]],
      jobId: [null]
    });
  }


  afterSave(res?: NzSafeAny) {
    this.router.navigate(['/kpi/kpi-managers/indicator-conversions/add-indicator-conversions'],
      { queryParams: { ...this.form.value, indicatorMasterId: res.data } });
  }

}



import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {ContributionRatesModel} from "../../../../data-access/models/configs/contribution-rates.model";
import {ContributionRatesService} from "../../../../data-access/services/configs/contribution-rates.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {ObjectUtil} from "@core/utils/object.util";
import {Constant} from "@app/modules/icn/data-access/constants/constant";
import { UrlConstant as UrlConstantShare } from '@shared/constant/url.class';

@Component({
  selector: 'crs-form',
  templateUrl: './crs-form.component.html',
  styleUrls: ['./crs-form.component.scss']
})
export class CrsFormComponent extends BaseFormComponent<ContributionRatesModel> implements OnInit {

  serviceName = MICRO_SERVICE.ICN
  urlLoadData = '/contribution-rates'
  listEmpTypeCode = ObjectUtil.optionsToList(Constant.ListEmpTypeCode);
  urlConstantShare = UrlConstantShare;

  constructor(
    private readonly service: ContributionRatesService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'contributionRateId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: ContributionRatesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: ContributionRatesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
  }

  override initForm() {
    this.form = this.fb.group({
      contributionRateId: [null],
      empTypeCode: [null, [Validators.required, Validators.maxLength(50)]],
      unitSocialPercent: [null, [Validators.required,Validators.max(100)]],
      perSocialPercent: [null, [Validators.required, Validators.max(100)]],
      unitMedicalPercent: [null, [Validators.required, Validators.max(100)]],
      perMedicalPercent: [null, [Validators.required, Validators.max(100)]],
      unitUnempPercent: [null, [Validators.required, Validators.max(100)]],
      perUnempPercent: [null, [Validators.required, Validators.max(100)]],
      unitUnionPercent: [null, [Validators.required, Validators.max(100)]],
      perUnionPercent: [null, [Validators.required, Validators.max(100)]],
      startDate: [null, [Validators.required]],
      endDate: [null],

    },
    {validators:
        [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
    });
  }

}



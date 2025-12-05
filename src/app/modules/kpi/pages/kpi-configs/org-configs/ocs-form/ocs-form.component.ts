import {Component, Injector, OnInit} from '@angular/core';
import {FormArray, Validators} from "@angular/forms";
import {OrgConfigsModel} from "../../../../data-access/models/kpi-configs/org-configs.model";
import {OrgConfigsService} from "../../../../data-access/services/kpi-configs/org-configs.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {Constant} from "@app/modules/crm/data-access/constants/constants";
import {DataService} from "@shared/services/data.service";
import {Scopes} from "@core/utils/common-constants";
import { Utils } from '@core/utils/utils';

@Component({
  selector: 'ocs-form',
  templateUrl: './ocs-form.component.html',
  styleUrls: ['./ocs-form.component.scss']
})
export class OcsFormComponent extends BaseFormComponent<OrgConfigsModel> implements OnInit {

  serviceName = MICRO_SERVICE.KPI
  urlLoadData = '/org-configs'
  scope = Scopes.VIEW;
  constructor(
    private readonly service: OrgConfigsService,
    private readonly dataService:DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'orgConfigId'
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: OrgConfigsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: OrgConfigsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'kpi_org_configs',
    });
    this.getConfigAttributes();
  }

  override initForm() {
    this.form = this.fb.group({
      orgConfigId: [null],
      organizationId: [null, [Validators.required]],
      orgTypeId: [null],
      year: [null, [Validators.required]],
      note: [null, [Validators.maxLength(500)]],
      listAttributes: this.fb.array([])

    },
    {validators:
        []
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  beforeSave() {
    super.beforeSave();
    this.body.year = Utils.convertDateToSendServer(this.f.year.value,'yyyy');
  }

  beforePatchValue() {
    super.beforePatchValue();
    if (this.data.year && Number.isInteger(this.data.year)) {
      this.data.year = this.data.year.toString();
    }
  }
}



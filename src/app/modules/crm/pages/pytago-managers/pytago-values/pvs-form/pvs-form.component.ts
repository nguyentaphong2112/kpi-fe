import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {PytagoValuesModel} from "../../../../data-access/models/pytago-managers/pytago-values.model";
import {PytagoValuesService} from "../../../../data-access/services/pytago-managers/pytago-values.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";

@Component({
  selector: 'pvs-form',
  templateUrl: './pvs-form.component.html',
  styleUrls: ['./pvs-form.component.scss']
})
export class PvsFormComponent extends BaseFormComponent<PytagoValuesModel> implements OnInit {

  serviceName = MICRO_SERVICE.CRM
  urlLoadData = '/pytago-values'
  constructor(
    private readonly service: PytagoValuesService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'pytagoValueId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: PytagoValuesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: PytagoValuesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      pytagoValueId: [null],
      indexNo: [null, [Validators.required, Validators.maxLength(20)]],
      value: [null, [Validators.required]],
      objectId: [null, [Validators.required]],
      tableName: [null, [Validators.required]],
      fileList: [null]

    },
    {validators:
        []
    });
  }
}



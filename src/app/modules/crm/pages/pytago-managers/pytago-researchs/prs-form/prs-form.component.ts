import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {PytagoResearchsModel} from "../../../../data-access/models/pytago-managers/pytago-researchs.model";
import {PytagoResearchsService} from "../../../../data-access/services/pytago-managers/pytago-researchs.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";

@Component({
  selector: 'prs-form',
  templateUrl: './prs-form.component.html',
  styleUrls: ['./prs-form.component.scss']
})
export class PrsFormComponent extends BaseFormComponent<PytagoResearchsModel> implements OnInit {

  serviceName = MICRO_SERVICE.CRM
  urlLoadData = '/pytago-researchs'
  constructor(
    private readonly service: PytagoResearchsService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'pytagoResearchId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: PytagoResearchsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: PytagoResearchsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      pytagoResearchId: [null],
      fullName: [null, [Validators.required, Validators.maxLength(255)]],
      dateOfBirth: [null, [Validators.required]],
      parentName: [null, [Validators.required, Validators.maxLength(255)]],
      mobileNumber: [null, [Validators.required, Validators.maxLength(20)]],
      email: [null, [Validators.required, Validators.maxLength(255)]],
      currentAddress: [null, [Validators.required, Validators.maxLength(255)]],
      type: [null, [Validators.required]],
      fileList: [null]

    },
    {validators:
        []
    });
  }
}



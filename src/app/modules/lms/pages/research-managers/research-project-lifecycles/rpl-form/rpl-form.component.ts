import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {ResearchProjectLifecyclesModel} from "../../../../data-access/models/research-managers/research-project-lifecycles.model";
import {ResearchProjectLifecyclesService} from "../../../../data-access/services/research-managers/research-project-lifecycles.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";

@Component({
  selector: 'rpl-form',
  templateUrl: './rpl-form.component.html',
  styleUrls: ['./rpl-form.component.scss']
})
export class RplFormComponent extends BaseFormComponent<ResearchProjectLifecyclesModel> implements OnInit {

  serviceName = MICRO_SERVICE.LMS
  urlLoadData = '/research-project-lifecycles'
  constructor(
    private readonly service: ResearchProjectLifecyclesService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'researchProjectLifecycleId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: ResearchProjectLifecyclesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: ResearchProjectLifecyclesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      researchProjectLifecycleId: [null],
      researchProjectId: [null, [Validators.required]],
      documentNo: [null, [Validators.required, Validators.maxLength(50)]],
      documentSignedDate: [null, [Validators.required]],
      type: [null, [Validators.required, Validators.maxLength(20)]],
      fileList: [null]

    },
    {validators:
        []
    });
  }
}



import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {ResearchProjectMembersModel} from "../../../../data-access/models/research-managers/research-project-members.model";
import {ResearchProjectMembersService} from "../../../../data-access/services/research-managers/research-project-members.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";

@Component({
  selector: 'rpm-form',
  templateUrl: './rpm-form.component.html',
  styleUrls: ['./rpm-form.component.scss']
})
export class RpmFormComponent extends BaseFormComponent<ResearchProjectMembersModel> implements OnInit {

  serviceName = MICRO_SERVICE.LMS
  urlLoadData = '/research-project-members'
  constructor(
    private readonly service: ResearchProjectMembersService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'researchProjectMemberId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: ResearchProjectMembersModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: ResearchProjectMembersModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      researchProjectMemberId: [null],
      researchProjectId: [null, [Validators.required]],
      roleId: [null, [Validators.required, Validators.maxLength(20)]],
      employeeId: [null, [Validators.required]],
      orderNumber: [null, [Validators.required]],
      note: [null, [Validators.required, Validators.maxLength(255)]],
      type: [null, [Validators.required, Validators.maxLength(20)]],
      fileList: [null]

    },
    {validators:
        []
    });
  }
}



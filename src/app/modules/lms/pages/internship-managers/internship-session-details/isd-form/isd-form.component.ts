import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {InternshipSessionDetailsModel} from "../../../../data-access/models/internship-managers/internship-session-details.model";
import {InternshipSessionDetailsService} from "../../../../data-access/services/internship-managers/internship-session-details.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";

@Component({
  selector: 'isd-form',
  templateUrl: './isd-form.component.html',
  styleUrls: ['./isd-form.component.scss']
})
export class IsdFormComponent extends BaseFormComponent<InternshipSessionDetailsModel> implements OnInit {

  serviceName = MICRO_SERVICE.LMS
  urlLoadData = '/internship-session-details'
  constructor(
    private readonly service: InternshipSessionDetailsService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'internshipSessionDetailId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: InternshipSessionDetailsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: InternshipSessionDetailsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      internshipSessionDetailId: [null],
      internshipSessionId: [null, [Validators.required]],
      majorId: [null, [Validators.required, Validators.maxLength(20)]],
      numOfStutdents: [null, [Validators.required]],
      fileList: [null]

    },
    {validators:
        []
    });
  }
}



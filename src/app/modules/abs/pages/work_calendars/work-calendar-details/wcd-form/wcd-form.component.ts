import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {WorkCalendarDetailsModel} from "../../../../data-access/models/work_calendars/work-calendar-details.model";
import {WorkCalendarDetailsService} from "../../../../data-access/services/work_calendars/work-calendar-details.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";

@Component({
  selector: 'wcd-form',
  templateUrl: './wcd-form.component.html',
  styleUrls: ['./wcd-form.component.scss']
})
export class WcdFormComponent extends BaseFormComponent<WorkCalendarDetailsModel> implements OnInit {

  serviceName = MICRO_SERVICE.ABS
  urlLoadData = '/work-calendar-details'
  constructor(
    private readonly service: WorkCalendarDetailsService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'workCalendarDetailId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: WorkCalendarDetailsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: WorkCalendarDetailsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      workCalendarDetailId: [null],
      workCalendarId: [null, [Validators.required]],
      dateTimekeeping: [null, [Validators.required]],
      workdayTimeId: [null, [Validators.required, Validators.maxLength(200)]],
      description: [null, [Validators.required, Validators.maxLength(200)]],
      fileList: [null]

    },
    {validators:
        []
    });
  }
}



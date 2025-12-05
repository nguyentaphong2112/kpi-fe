import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {WorkCalendarsModel} from "../../../../data-access/models/work_calendars/work-calendars.model";
import {WorkCalendarsService} from "../../../../data-access/services/work_calendars/work-calendars.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";

@Component({
  selector: 'wcs-form',
  templateUrl: './wcs-form.component.html',
  styleUrls: ['./wcs-form.component.scss']
})
export class WcsFormComponent extends BaseFormComponent<WorkCalendarsModel> implements OnInit {

  serviceName = MICRO_SERVICE.ABS
  urlLoadData = '/work-calendars'
  constructor(
    private readonly service: WorkCalendarsService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'workCalendarId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: WorkCalendarsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: WorkCalendarsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      workCalendarId: [null],
      name: [null, [Validators.required, Validators.maxLength(200)]],
      monWorkTimeId: [null, [Validators.required, Validators.maxLength(20)]],
      tueWorkTimeId: [null, [Validators.required, Validators.maxLength(20)]],
      wedWorkTimeId: [null, [Validators.required, Validators.maxLength(20)]],
      thuWorkTimeId: [null, [Validators.required, Validators.maxLength(20)]],
      friWorkTimeId: [null, [Validators.required, Validators.maxLength(20)]],
      satWorkTimeId: [null, [Validators.required, Validators.maxLength(20)]],
      sunWorkTimeId: [null, [Validators.required, Validators.maxLength(20)]],
      defaultHodidayDate: [null, [Validators.required, Validators.maxLength(2000)]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      fileList: [null]

    },
    {validators:
        [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
    });
  }
}



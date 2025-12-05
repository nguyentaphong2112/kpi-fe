import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {TimekeepingsModel} from "../../../../data-access/models/timekeeping-manager/timekeepings.model";
import {TimekeepingsService} from "../../../../data-access/services/timekeeping-manager/timekeepings.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {
  TimekeepingOvertimeService
} from "@app/modules/abs/data-access/services/timekeeping-manager/timekeeping-overtime.service";

@Component({
  selector: 'timekeepings-form',
  templateUrl: './toe-form.component.html',
  styleUrls: ['./toe-form.component.scss']
})
export class ToeFormComponent extends BaseFormComponent<TimekeepingsModel> implements OnInit {

  serviceName = MICRO_SERVICE.ABS
  urlLoadData = '/timekeepings'
  constructor(
    private readonly service: TimekeepingOvertimeService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'timekeepingId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: TimekeepingsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: TimekeepingsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      timekeepingId: [null],
      employeeId: [null, [Validators.required]],
      dateTimekeeping: [null, [Validators.required]],
      workdayTypeId: [null, [Validators.required]],
      totalHours: [null, [Validators.required]],
      fileList: [null]

    },
    {validators:
        []
    });
  }
}



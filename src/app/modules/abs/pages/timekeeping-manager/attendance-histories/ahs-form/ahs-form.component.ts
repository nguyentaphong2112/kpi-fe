import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {AttendanceHistoriesModel} from "../../../../data-access/models/timekeeping-manager/attendance-histories.model";
import {
  AttendanceHistoriesService
} from "../../../../data-access/services/timekeeping-manager/attendance-histories.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE, SYSTEM_FORMAT_DATA} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {DateUtils} from "@shared/utils/date-utils.class";
import * as moment from "moment";
import {Utils} from "@core/utils/utils";
import {parse} from "date-fns";

@Component({
  selector: 'ahs-form',
  templateUrl: './ahs-form.component.html',
  styleUrls: ['./ahs-form.component.scss']
})
export class AhsFormComponent extends BaseFormComponent<AttendanceHistoriesModel> implements OnInit {

  serviceName = MICRO_SERVICE.ABS
  urlLoadData = '/attendance-histories'
  constructor(
    private readonly service: AttendanceHistoriesService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'attendanceHistoryId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: AttendanceHistoriesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: AttendanceHistoriesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      attendanceHistoryId: [null],
      employeeId: [null],
      checkInTime: [null],
      checkOutTime: [null],
      isValid: [null],
      statusId: [null],
      dateTimekeeping: [CommonUtils.parseDateFromString(this.data?.dateTimekeeping) ?? null, [Validators.required]],
      validCheckInTime: [null, [Validators.required]],
      validCheckOutTime: [null, [Validators.required]],
      reasonId: [null, [Validators.required]],
      reasonDetail: [null]

    },
    {validators:
        [DateValidator.validateTwoDateTime('validCheckInTime', 'validCheckOutTime')]
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

  beforeSave() {
    const formValue = this.form.value
    const dateTimekeeping = formValue.dateTimekeeping
    const validCheckInTime = this.combineDateAndTime(dateTimekeeping,formValue.validCheckInTime)
    const validCheckOutTime = this.combineDateAndTime(dateTimekeeping,formValue.validCheckOutTime)
    this.body = {
      ...this.body,
      validCheckInTime: validCheckInTime,
      validCheckOutTime: validCheckOutTime
    }
  }

  beforePatchValue() {
    super.beforePatchValue();
    this.data.validCheckInTime = moment(this.data.validCheckInTime,"dd/MM/yyyy HH:mm:ss").toDate()
    this.data.validCheckOutTime = moment(this.data.validCheckOutTime,"dd/MM/yyyy HH:mm:ss").toDate()
  }

  combineDateAndTime(date: Date, time: Date | string): any {
    let timeDate: Date;

    if (time instanceof Date) {
      timeDate = time;
    }
    else if (typeof time === 'string') {
      timeDate = moment(time, SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT).toDate();
    } else {
      throw new Error('Invalid time format');
    }
    const hours = timeDate.getHours();
    const minutes = timeDate.getMinutes()
    const combined = moment(date).set({ hour: hours, minute: minutes, second: 0 });
    return Utils.convertDateToSendServer(combined.toDate(),SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT) ;

  }

}



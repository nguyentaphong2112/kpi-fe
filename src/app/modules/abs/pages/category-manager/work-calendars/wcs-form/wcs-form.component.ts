import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {WorkCalendarsModel} from "../../../../data-access/models/work_calendars/work-calendars.model";
import {WorkCalendarsService} from "../../../../data-access/services/work_calendars/work-calendars.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {HTTP_STATUS_CODE, MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {CatalogModel} from "@app/modules/abs/data-access/models/catalog-model";
import {DataService} from "@shared/services/data.service";
import {BaseResponse} from "@shared/data-access";
import {WorkCalendars} from "@app/modules/abs/data-access/models/work-calendars";
import {ToastrService} from "ngx-toastr";
import * as moment from "moment";

@Component({
  selector: 'wcs-form',
  templateUrl: './wcs-form.component.html',
  styleUrls: ['./wcs-form.component.scss']
})
export class WcsFormComponent extends BaseFormComponent<WorkCalendarsModel> implements OnInit {
  workCalendarId?: number;
  workTimeList: CatalogModel[];
  serviceName = MICRO_SERVICE.ABS
  urlLoadData = '/work-calendars'

  constructor(
    private readonly service: WorkCalendarsService,
    private readonly toastr: ToastrService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'workCalendarId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: WorkCalendarsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: WorkCalendarsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  initForm() {
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
        defaultHolidayDate: [null, [Validators.required, Validators.maxLength(2000)]],
        startDate: [null],
        endDate: [null,],
      },
      {
        validators:
          [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
      });
  }

  ngOnInit() {
    super.ngOnInit();
    this.getWorkTimeList();
    if (!this.workCalendarId) {
      return;
    }
    this.service.getRecord(this.workCalendarId).subscribe((res: BaseResponse) => {
      if (res.code !== "SUCCESS") {
        this.toastr.error(this.translate.instant('common.notification.updateError') + ": " + res.message);
        this.modalRef.close({refresh: false});
        return;
      }
      const formData: WorkCalendars = res.data;
      this.form.patchValue({
        ...formData,
        startDate: moment(formData.startDate, 'DD/MM/YYYY').toDate(),
        endDate: moment(formData.endDate, 'DD/MM/YYYY').toDate()
      });
    });
  }

  getWorkTimeList() {
    const url = this.getUrlCategory(this.categoryCode.LICH_LAM_VIEC);
    this.subscriptions.push(
      this.dataService.getData(url, this.microService.ADMIN, true).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.workTimeList = res.data;
        }
      })
    );
  }

}



import {ActivatedRoute} from '@angular/router';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {TranslateService} from '@ngx-translate/core';
import {CategoriesService} from "@shared/services/categories.service";
import {HTTP_STATUS_CODE, MICRO_SERVICE} from "@core/constant/system.constants";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UrlConstant} from "@shared/constant/url.class";
import {CATEGORY_CODE, REQUEST_TYPE} from "@shared/constant/common";
import {CommonUtils} from "@shared/services/common-utils.service";
import {
  WorkCalendarDetailsService
} from "@app/modules/abs/data-access/services/work_calendars/work-calendar-details.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() public month?: string;
  @Input() public mapWorkCalendarDetails: any;
  @Input() public listWorkdayType?: any[];
  @Output() triggerSearch = new EventEmitter<void>();
  public firstDayOfMonth: any;
  public firstDayOfWeek: any;
  public listWeek: any = [];
  public mapDescriptions: any = {};
  categoryCode = CATEGORY_CODE;
  microService = MICRO_SERVICE;
  checkData = false;
  isVisible = false;
  isSubmittedModal = false;
  formModal:FormGroup;
  selectedData:any;
  constructor(
    public actr: ActivatedRoute,
    public translateService: TranslateService,
    private fb:FormBuilder,
    private toast:ToastrService,
    private service:WorkCalendarDetailsService) {
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.initFormModal()
    this.firstDayOfMonth = moment('01/' + this.month, 'DD/MM/YYYY');
    this.firstDayOfWeek = this.startOfWeek(moment('01/' + this.month, 'DD/MM/YYYY'));
    const numOfDays = 35;
    for (let i = 0; i < numOfDays; i++) {
      const t = this.startOfWeek(moment('01/' + this.month, 'DD/MM/YYYY'));
      let weekNum = i / 7;
      weekNum = parseInt('' + weekNum);
      let current: any = [];
      if (this.listWeek.length > weekNum) {
        current = this.listWeek[weekNum];
      } else {
        this.listWeek[weekNum] = current;
      }
      const item = this.firstDayOfWeek.clone().add(i, 'day');
      this.makeStringWorkDay(item);
      current.push(item);
      this.listWeek[weekNum] = current;
    }
  }

  initFormModal(){
    this.formModal = this.fb.group({
      workCalendarDetailId:[null],
      workdayTimeId:[null,Validators.required],
      dateTimekeeping:[null],
      workCalendarId:[null]
    })
  }

  handleOk(){
    this.isSubmittedModal = true;
    if(this.formModal.invalid){
      return null;
    }
    const data = CommonUtils.convertDataSendToServer(this.formModal.value)
    this.service.update({...data,id:data.workCalendarDetailId}, REQUEST_TYPE.DEFAULT).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(
          this.translateService.instant('common.notification.updateSuccess')
        );
        this.triggerSearch.emit();
        this.isVisible = false;
        this.formModal.reset();
      }
    });
    this.isSubmittedModal = false;
  }

  handleCancel(){
    this.isVisible = false
    this.selectedData = {};
    this.formModal.reset()
  }

  openModal(data){
    this.isVisible = true;
    this.selectedData = data;

    this.formModal.patchValue({
      ...this.selectedData,
      workdayTimeId: String(this.selectedData.workdayTimeId),
    });
  }

  startOfWeek(momentDate: any) {
    let iDate = momentDate.clone();
    while (iDate.day() != 1) {
      iDate = iDate.add(-1, 'day');
    }
    return iDate;
  }

  makeStringWorkDay(time: any): any {
    const dataString = time.format('DD/MM/YYYY');
    const bean = this.mapWorkCalendarDetails[dataString];
    this.mapDescriptions[dataString] = '';
    if (!bean) {
      return;
    }
    const list = [];
    if (bean.workdayTime) {
      list.push(this.listWorkdayType.find(s => s.code === bean.workdayTime)?.name);
    }
    // if (bean.workdayTime) {
    //   list.push(this.translateService.instant('staffAbs.workCalendar.workTime.' + bean.workdayTime));
    // }
    if (bean.description) {
      list.push(bean.description);
    }
    this.mapDescriptions[dataString] = list.join(', ');
  }

  getUrlCategory(typeCode: string): string {
    return UrlConstant.GET_CATEGORIES.replace('{typeCode}', typeCode);
  }

  protected readonly moment = moment;
  protected readonly CATEGORY_CODE = CATEGORY_CODE;
}

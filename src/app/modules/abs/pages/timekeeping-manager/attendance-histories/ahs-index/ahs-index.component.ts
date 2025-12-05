import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AttendanceHistoriesModel } from '../../../../data-access/models/timekeeping-manager/attendance-histories.model';
import { AttendanceHistoriesService } from '../../../../data-access/services/timekeeping-manager/attendance-histories.service';
import { BaseListComponent } from '@core/components/base-list.component';
import {HTTP_STATUS_CODE, MICRO_SERVICE, STORAGE_NAME} from '@core/constant/system.constants';
import {CommonUtils, ValidateService} from '@shared/services/common-utils.service';
import {Mode, REQUEST_TYPE, TABLE_CONFIG_DEFAULT} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {_variable} from "@core/global-style/_variable";
import {TimekeepingsModel} from "@app/modules/abs/data-access/models/timekeeping-manager/timekeepings.model";
import {ToastrService} from "ngx-toastr";
import {ActionSchema, ChildActionSchema} from "@core/models/action.model";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {StorageService} from "@core/services/storage.service";
import {FrpFormComponent} from "@app/modules/hrm/pages/staff-research/family-relationship/frp-form/frp-form.component";
import {
  AhsFormComponent
} from "@app/modules/abs/pages/timekeeping-manager/attendance-histories/ahs-form/ahs-form.component";
import {HBTTableConfig} from "@shared/component/hbt-table/hbt-table.interfaces";
import {DateUtils} from "@shared/utils/date-utils.class";
import {Utils} from "@core/utils/utils";
import * as moment from "moment";
import {FunctionCode} from "@shared/enums/enums-constant";
import {ValidationService} from "@shared/services/validation.service";
import {Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged,combineLatest} from "rxjs";

@Component({
  selector: 'app-ahs-index',
  templateUrl: './ahs-index.component.html',
  styleUrls: ['./ahs-index.component.scss']
})


export class AhsIndexComponent extends BaseListComponent<AttendanceHistoriesModel> implements OnInit {
  serviceName = MICRO_SERVICE.ABS;
  urlLoadData = '/attendance-histories';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  _variable = _variable
  tableConfig1: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };
  tableResult1:any
  Mode = Mode
  functionCode = FunctionCode.ABS_ATTENDANCE_HISTORIES;
  currentDate:Date;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  @ViewChild('timekeepingDayTmpl', { static: true }) timekeepingDay!: TemplateRef<any>;
  @ViewChild('validTmpl', { static: true }) validTmpl!: TemplateRef<any>;
  @ViewChild('contentTmpl', { static: true }) content!: TemplateRef<any>;


  constructor(
    injector: Injector,
    private readonly service: AttendanceHistoriesService,
    protected toastrService :ToastrService,
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination,'/current-user');
    this.approveByListApi = (listId: number[], afterUrl?: string) => this.service.approveByList(listId);
    this.rejectByListApi = (listId: number[], rejectReason: string, afterUrl?: string) => this.service.rejectByList(listId, rejectReason);
    this.approveAllApi = (data: any, afterUrl?: string) => this.service.approveAll(CommonUtils.convertDataSendToServer(data));
    this.serviceName = MICRO_SERVICE.ABS;
    this.key = 'attendanceHistoryId';
    this.formConfig = {
      title: 'abs.attendanceHistories.label.title',
      content: AhsFormComponent,
      isCloseModal: true,
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
    this.initTimeSearch();
    this.onDateChange();
  }

  initFormSearch() {
    this.form = this.fb.group({
      startDate:[null,[Validators.required]],
      endDate:[null,[Validators.required]]
    },{
      validators:
        [DateValidator.validateTwoDate('startDate', 'endDate','greaterAndEqual')]
    });
  }

  get f() {
    return this.form.controls;
  }

  initTimeSearch(){

    if (this.form) {
      this.currentDate = new Date();
      this.f.startDate.setValue(this.getFirstDayOfMonthMinusFiveDays())
      this.f.endDate.setValue(this.currentDate);
      this.search()
    }
  }

  onDateChange(){
    this.subscriptions.push(
        this.f.startDate.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => {
        if (this.form.valid) {
          this.search();
        }
      })
    )
    this.subscriptions.push(
      this.f.endDate.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => {
          if (this.form.valid) {
            this.search();
          }
        })
    )

  }

  getFirstDayOfMonthMinusFiveDays() {
    const dateMinusFive = moment().subtract(5, 'days');

    const firstDayOfMonth = dateMinusFive.startOf('month');

    return firstDayOfMonth.toDate();
  }

  doOpenForm(mode: Mode, data?: AttendanceHistoriesModel) {
    super.doOpenForm(mode, data);
    this.modalRef.updateConfig({nzWidth:'35%'})
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'eye',
          isShow: this.objFunction?.edit,
          function: this.doOpenFormEdit
        })
      ]
    });
  }

  openLog(mode:Mode,data) {
    this.service.getLogData({dateTimekeeping:data.dateTimekeeping}).subscribe(res=>{
      this.tableResult1 = res.data.listData
    })
    this.modalRef = this.modal.create({
      nzWidth: '35%',
      nzTitle: this.translate.instant('abs.attendanceHistories.label.checkInLog'),
      nzContent: this.content,
      // nzComponentParams: {
      //   mode,
      //   data
      // },
      nzFooter: null
    });
  }

 getVietnameseDayName(stringDate: String): string {
  if(stringDate){
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const dayIndex = CommonUtils.parseDateFromString(stringDate).getDay();
    return dayNames[dayIndex];
  } else {
    return null;
  }
  }

  override beforeSearch() {
  }

  override beforeRenderTable() {
    this.responseSearch.data.listData.forEach(el => {
      el.checkInTime = el.checkInTime? moment(el.checkInTime).format("HH:mm") : null;
      el.checkOutTime = el.checkOutTime? moment(el.checkOutTime).format("HH:mm") : null;
      el.validCheckInTime = el.validCheckInTime? moment(el.validCheckInTime,"yyyy-MM-dd HH:mm:ss").format("HH:mm") : null;
      el.validCheckOutTime = el.validCheckOutTime? moment(el.validCheckOutTime,"yyyy-MM-dd HH:mm:ss").format("HH:mm") : null;
    });
  }

  override beforeExport() {
  }

  openForm(data){
    if(data?.attendanceHistoryId){
      this.doOpenFormEdit(data)
    } else {
      this.doOpenForm(this.modeConst.ADD,data)
    }
  }



  override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'abs.attendanceHistories.table.timekeepingDay',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.timekeepingDay,
        width: 70,
        rowspan: 2,
        thClassList: ['text-center'],
        tdClassList: ['text-center'],

      },
      {
        title: 'abs.attendanceHistories.table.dateTimekeeping',
        field: 'dateTimekeeping',
        width: 100,
        rowspan: 2,
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
      },
      {
        title: 'abs.attendanceHistories.table.workSchedule',
        field: 'workScheduleName',
        width: 100,
        rowspan: 2,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'abs.attendanceHistories.table.leaveInformation',
        field: 'leaveInformation',
        width: 150,
        rowspan: 2,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'abs.attendanceHistories.table.checkInInfo',
        width: 180,
        colspan: 3,
        thClassList: ['text-center'],
        child: [
          {
            title: 'abs.attendanceHistories.table.checkInTime',
            field: 'checkInTime',
            thClassList: ['text-center'],
            tdClassList: ['text-center'],
            width:70,
          },
          {
            title: 'abs.attendanceHistories.table.checkOutTime',
            field: 'checkOutTime',
            thClassList: ['text-center'],
            tdClassList: ['text-center'],
            width:70,
          },
          {
            title: 'abs.attendanceHistories.table.isValid',
            fieldType:'tdTemplate',
            fieldTypeValue: this.validTmpl,
            thClassList: ['text-center'],
            tdClassList: ['text-center'],

          },
        ]
      },
      {
        title: 'abs.attendanceHistories.table.validRequest',
        width: 180,
        colspan: 4,
        thClassList: ['text-center'],
        child: [
          {
            title: 'abs.attendanceHistories.table.validCheckInTime',
            field: 'validCheckInTime',
            thClassList: ['text-center'],
            tdClassList: ['text-center'],
            width:70,
          },
          {
            title: 'abs.attendanceHistories.table.validCheckOutTime',
            field: 'validCheckOutTime',
            thClassList: ['text-center'],
            tdClassList: ['text-center'],
            width:70,
          },
          {
            title: 'abs.attendanceHistories.table.reason',
            field: 'reasonName',
            thClassList: ['text-center'],
            tdClassList: ['text-center'],
          },
          {
            title: 'abs.attendanceHistories.table.status',
            field: 'statusName',
            thClassList: ['text-center'],
            tdClassList: ['text-center'],
          },
        ]
      },
      {
        title: 'abs.annualLeaves.table.createdBy',
        field: 'createdBy',
        rowspan: 2,
        width: 150,
        show: false
      },
      {
        title: 'abs.annualLeaves.table.createdTime',
        field: 'createdTime',
        width: 120,
        rowspan: 2,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'abs.annualLeaves.table.modifiedBy',
        field: 'modifiedBy',
        width: 150,
        rowspan: 2,
        show: false
      },
      {
        title: 'abs.annualLeaves.table.modifiedTime',
        field: 'modifiedTime',
        width: 120,
        rowspan: 2,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: ' ',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
        width: 80,
        rowspan: 2,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: window.innerWidth > 1024,
        fixedDir: 'right',
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit
      }
    ];

    this.tableConfig1.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 70
      },
      {
        title: 'abs.attendanceHistories.table.logTime',
        field:'logTime',
        width: 70,
        rowspan: 2,
        thClassList: ['text-center'],
        tdClassList: ['text-center'],

      },
      {
        title: 'abs.attendanceHistories.table.logAddress',
        field: 'address',
        width: 100,
        rowspan: 2,
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
      },
    ]
  }

  protected readonly innerWidth = innerWidth;

  protected readonly DateUtils = DateUtils;
  protected readonly Utils = Utils;
  protected readonly CommonUtils = CommonUtils;
}


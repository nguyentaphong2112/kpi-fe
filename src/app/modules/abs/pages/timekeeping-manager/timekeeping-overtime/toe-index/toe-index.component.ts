import { Component, HostListener, Injector, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TimekeepingsModel } from '../../../../data-access/models/timekeeping-manager/timekeepings.model';
import { TimekeepingsService } from '../../../../data-access/services/timekeeping-manager/timekeepings.service';
import { BaseListComponent } from '@core/components/base-list.component';
import {HTTP_STATUS_CODE, MICRO_SERVICE, SYSTEM_FORMAT_DATA} from '@core/constant/system.constants';
import { CommonUtils, ValidateService } from '@shared/services/common-utils.service';
import {Mode, REQUEST_TYPE} from '@shared/constant/common';
import { UrlConstant as UrlConstantShare } from '@shared/constant/url.class';
import { HttpParams } from '@angular/common/http';
import { StringUtils } from '@shared/utils/string-utils.class';
import {FormArray, FormGroup, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Scopes } from '@core/utils/common-constants';
import { DateUtils } from '@shared/utils/date-utils.class';
import { _variable } from '@core/global-style/_variable';
import {debounceTime, distinctUntilChanged} from "rxjs";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {CategoryTypesModel} from "@app/modules/admin/data-access/models/categories/category-types.model";
import {CtsFormComponent} from "@app/modules/admin/pages/categories/category-types/cts-form/cts-form.component";
import {WorkdayTypesService} from "@app/modules/abs/data-access/services/category-manager/workday-types.service";
import * as moment from "moment";
import {UrlConstant} from "@app/modules/hrm/data-access/constant/url.class";
import {
  TimekeepingOvertimeService
} from "@app/modules/abs/data-access/services/timekeeping-manager/timekeeping-overtime.service";
import {Utils} from "@core/utils/utils";

@Component({
  selector: 'app-timekeepings-index',
  templateUrl: './toe-index.component.html',
  styleUrls: ['./toe-index.component.scss']
})


export class ToeIndexComponent extends BaseListComponent<TimekeepingsModel> implements OnInit {
  serviceName = MICRO_SERVICE.ABS;
  urlLoadData = '/timekeepings';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  searchResult: TimekeepingsModel[] = [];
  loading = false;
  count = 0;
  isSearch = false;
  colSpan = 1;
  nzScrollWidth?: number;
  nzWidthConfig = [];
  scope = Scopes.CREATE;
  @Input() data: any;
  isShowAdvSearch = false;
  formTimekeeping:FormGroup;

  selectedData:any;
  isVisible = false;
  isSubmittedModal = false;


  date = new Date();
  startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  endDate = new Date(this.date.getFullYear(), this.date.getMonth(), DateUtils.getDaysInMonth(this.date.getFullYear(), this.date.getMonth()));
  _variable = _variable;
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: TimekeepingOvertimeService,
    private readonly workdayTypeService:WorkdayTypesService,
    protected toastrService: ToastrService,
    public validateService: ValidateService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.FORM_DATA, '/import');
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.doDownloadFileByNameApi = (url: string) => this.service.downloadFile(url);
    this.approveByListApi = (listId: number[], afterUrl?: string) => this.service.approveByList(listId);
    this.rejectByListApi = (listId: number[], rejectReason: string, afterUrl?: string) => this.service.rejectByList(listId, rejectReason);
    this.approveAllApi = (data: any, afterUrl?: string) => this.service.approveAll(CommonUtils.convertDataSendToServer(data));
    this.serviceName = MICRO_SERVICE.ABS;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'timekeepingId';
  }

  get startDate1() {
    return this.form.get('startDate');
  }

  combineDateAndTime(date: Date, time: Date): any {
    const hours = time.getHours();
    const minutes = time.getMinutes()
    const combined = moment(date).set({ hour: hours, minute: minutes, second: 0 });
    return Utils.convertDateToSendServer(combined.toDate(),SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT) ;

  }

  handleOk(){
    this.isSubmittedModal = true;
    if(this.formTimekeeping.invalid){
      return null;
    }
    const dateTimekeeping = this.formTimekeeping.value.dateTimekeeping;
    let data = this.formTimekeeping.value
    data = {
      ...data,
      startTime: this.combineDateAndTime(dateTimekeeping, data.startTime),
      endTime: this.combineDateAndTime(dateTimekeeping, data.endTime),
    }

    this.service.createOrImport(CommonUtils.convertDataSendToServer(data), REQUEST_TYPE.DEFAULT).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(
          this.translate.instant('common.notification.addSuccess')
        );
        this.isVisible = false;

        const employeeId = this.selectedData.employeeId;
        const day = this.selectedData.day;
        const workdayType = res.data;

        const employee = this.searchResult.find(emp => emp.employeeId === employeeId);

        if (employee) {
          if (!employee.timekeepings) {
            employee.timekeepings = {};
          }
          employee.timekeepings[day] = workdayType;
        }

        this.formTimekeeping.reset()
      }
    });
    this.isSubmittedModal = false;

  }
  handleCancel(){
    this.isSubmittedModal = false;
    this.formTimekeeping.reset()
    this.isVisible = false;
  }

  doOpenModal(data,day) {
    if (day.dayOfWeek == '7' || day.dayOfWeek == '1') {
      return;
    }
    this.selectedData = {
      employeeId:data.employeeId,
      dateTimekeeping: new Date(day.date),
      workdayType: data.timekeepings?.[day.day] ?? null,
      day:day.day,
      content:null
    }
    this.isVisible = true;
    this.formTimekeeping.patchValue(this.selectedData);

  }

  initFormSearch() {
    this.form = this.fb.group({
      organizationId: [null],
      empTypeId: [null],
      empStatus: [null],
      keySearch: [''],
      employeeCode: [0],
      startDate: [this.startDate, [Validators.required]],
      endDate: [this.endDate, [Validators.required]]
    },
      );
    this.formTimekeeping = this.fb.group({
      employeeId:[null],
      dateTimekeeping:[null],
      workdayType:[null,Validators.required],
      overtimeTypeId: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      content:[null, [Validators.required]]
    },
      {
        validators: [DateValidator.validateTwoDateTime('startTime', 'endTime')]
      })

  }

  override beforeSearch() {
  }

  override beforeRenderTable() {
    this.responseSearch.data.listData.forEach(el => {
      // el.list = this.list;
    });
  }

  override beforeExport() {
  }

  ngOnInit() {
    super.ngOnInit();
    this.onDateChange();
  }



  get f() {
    return this.form.controls;
  }



  onDateChange(){
    const { startDate, endDate } = this.f;

    this.subscriptions.push(
      startDate.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
        if (this.isMoreThanOneMonth(startDate.value, endDate.value)) {
          endDate.setValue(this.addMonths(startDate.value, 1));
          if (this.form.valid) this.search();
        }
      }),

      endDate.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
        if (this.isMoreThanOneMonth(startDate.value, endDate.value)) {
          startDate.setValue(this.addMonths(endDate.value, -1));
          if (this.form.valid) this.search();
        }
      })
    );
  }

  isMoreThanOneMonth(date1: Date, date2: Date): boolean {
    if (!(date1 instanceof Date) || !(date2 instanceof Date) || isNaN(date1.getTime()) || isNaN(date2.getTime())) {
      return false;
    }

    if (date1 > date2) {
      return true;
    }

    const oneMonthLater = new Date(date1.getFullYear(), date1.getMonth() + 1, date1.getDate() - 1);

    return date2 > oneMonthLater;
  }

  addMonths(date: Date, monthOver: number) {
    const day = date.getDate();
    const targetDay = monthOver < 0 ? day + 1 : day - 1;
    let dateAfter = new Date(date.getFullYear(), date.getMonth() + monthOver, targetDay);
    if (dateAfter.getMonth() > date.getMonth() + monthOver) {
      dateAfter = new Date(date.getFullYear(), date.getMonth() + monthOver + 1, 1);
    }
    return dateAfter;
  }

  parseOptions() {
    let params = new HttpParams();
    if (!StringUtils.isNullOrEmpty(this.form.controls['organizationId'].value))
      params = params.set('organizationId', this.form.controls['organizationId'].value);
    if (!StringUtils.isNullOrEmpty(this.form.controls['keySearch'].value))
      params = params.set('keySearch', this.form.controls['keySearch'].value);
    if (!StringUtils.isNullOrEmpty(this.form.controls['startDate'].value))
      params = params.set('startDate', this.convertDate(this.form.controls['startDate'].value));
    if (!StringUtils.isNullOrEmpty(this.form.controls['endDate'].value))
      params = params.set('endDate', this.convertDate(this.form.controls['endDate'].value));
    if (this.form?.value.empTypeId)
      params = params.set('empTypeId', this.form.value.empTypeId.join(','));
    if (this.form?.value.empStatus)
      params = params.set('empStatus', this.form.value.empStatus.join(','));
    return params;
  }

  convertDate(date: Date): string {
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

  timekeepingAuto() {
    if (this.form.valid) {
      this.isLoading = true;
      const formValue = this.form.value;
      const data = CommonUtils.convertDataSendToServer(formValue);
      this.service.timekeepingAuto(data).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.search(1);
          this.isLoading = false;
          this.toastrService?.success(res.message);
        } else {
          this.toastrService?.error(res.message);
        }
      }, () => {
        this.isLoading = false;
      });
    }
  }

  search(pageNumber?: number) {
    this.isSubmitted = true;
    this.pagination.pageNumber = pageNumber ?? 1;
    this.isSearch = true;
    if (this.form.valid) {
      const params = this.parseOptions();
      this.isLoading = true;
      this.service.searchTimeKeeping(params, this.pagination.getCurrentPage()).subscribe(res => {
        this.isLoading = false;
        if (res.code == HTTP_STATUS_CODE.SUCCESS) {
          this.searchResult = res.data.listData;
          this.count = res.data.count;
          this.colSpan = res.data.listData[0]?.dateList.length;
          this.nzScrollWidth = 500 + this.colSpan * 50;
          const baseWidths = ['50px', '70px', '180px'];
          const middleWidths = Array(this.colSpan).fill('70px');
          const endWidths = ['100px', '100px', '250px'];

          this.nzWidthConfig = [...baseWidths, ...middleWidths, ...endWidths];
          this.ref.markForCheck();
        }
      }, () => this.loading = false);
    }
  }

  protected readonly innerWidth = innerWidth;
  protected readonly Mode = Mode;
  protected readonly DateUtils = DateUtils;
  protected readonly moment = moment;
  protected readonly sea = module
}


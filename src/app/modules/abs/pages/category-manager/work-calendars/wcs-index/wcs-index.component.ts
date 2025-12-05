import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {WorkCalendars} from "@app/modules/abs/data-access/models/work-calendars";
import {CatalogModel} from "@shared/model/catalog-model";
import {WorkCalendarService} from "@app/modules/abs/data-access/services/work-calendar.service";
import {WorkCalendarDetailService} from "@app/modules/abs/data-access/services/work-calendar-detail.service";
import {BaseResponse} from "@shared/data-access";
import {HTTP_STATUS_CODE, MICRO_SERVICE} from "@core/constant/system.constants";
import {WcsFormComponent} from "@app/modules/abs/pages/category-manager/work-calendars/wcs-form/wcs-form.component";
import {BaseListComponent} from "@core/components/base-list.component";
import {REQUEST_TYPE} from "@shared/constant/common";
import {NzUploadFile} from "ng-zorro-antd/upload";
import {Subscription} from "rxjs";
import {AlertModalChangeService} from "@app/modules/hrm/data-access/services/staff-info/alert-modal-change.service";
import {DataService} from "@shared/services/data.service";

@Component({
  selector: 'micro-fe-work-calendar-page',
  templateUrl: './wcs-index.component.html',
  styleUrls: ['./wcs-index.component.scss'],
})
export class WcsIndexComponent extends BaseListComponent<WorkCalendars> implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  workCalendarList: WorkCalendars[] = [];
  mapWorkCalendarDetails: any;
  listYear: CatalogModel[] = [];
  listMonth: any = [];
  workCalendars: WorkCalendars = {};
  fileList: NzUploadFile[] = [];
  isLoading = false;
  listWorkdayType = [];
  @ViewChild('attachFileTmpl', {static: true}) attachFile!: TemplateRef<any>;
  private closeStaffInfoSubscription: Subscription;

  constructor(
    injector: Injector,
    private _fb: FormBuilder,
    public workCalendarService: WorkCalendarService,
    public workCalendarDetailService: WorkCalendarDetailService,
    private alertModalChangeService: AlertModalChangeService,
    public translateService: TranslateService,
    private dataService: DataService,
  ) {
    super(injector);
    this.form = this._fb.group({
      workCalendarId: [null, [Validators.required]],
      year: [null, [Validators.required]]
    });
    this.listYear = this.getYearList();
    this.importApi = (body) => this.workCalendarDetailService.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import');
    this.downLoadTemplateApi = () => this.workCalendarDetailService.downloadFile('/download-template');
    this.doDownloadFileByNameApi = (url: string) => this.workCalendarDetailService.downloadFile(url);
    this.approveByListApi = (listId: number[], afterUrl?: string) => this.workCalendarDetailService.approveByList(listId);
    this.rejectByListApi = (listId: number[], rejectReason: string, afterUrl?: string) => this.workCalendarDetailService.rejectByList(listId, rejectReason);

    this.serviceName = MICRO_SERVICE.ABS;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'workCalendarDetailsId';

    this.formConfig = {
      title: 'abs.workCalendar.nameModule',
      content: WcsFormComponent
    };

  }

  ngOnInit(): void {
    this.loadWorkCalendarDataSource(null);
    this.getListWorkdayType();
    const currentYear = new Date().getFullYear();
    this.form.controls['year'].setValue(currentYear);
    this.form.controls['year'].valueChanges.subscribe(() => {
      this.search();
    });
    this.onListener();
  }

  loadWorkCalendarDataSource(workCalendarId: number | null) {
    this.workCalendarService.getActiveWorkCalendars().subscribe(
      (res: BaseResponse) => {
          this.workCalendarList = res.data;
          if (!!res.data && res.data.length > 0) {
            if (!workCalendarId) {
              this.form.controls['workCalendarId'].setValue(
                res.data[0].workCalendarId
              );
            }
        }
      },
      () => {
        this.workCalendarList = [];
      }
    );
  }

  override search(): void {
    const workCalendarId = this.form.controls['workCalendarId'].value;
    const year = this.form.controls['year'].value;

    if (!workCalendarId || !year) return;

    this.isLoading = true;
    const startDate = moment(`01/01/${year}`, 'DD/MM/YYYY').startOf('month');
    const endDate = moment(`31/12/${year}`, 'DD/MM/YYYY').endOf('month');

    this.workCalendarDetailService.search({workCalendarId, year}).subscribe(
      (res) => {
        this.mapWorkCalendarDetails = res.data.reduce((acc: any, item: any) => ({
          ...acc,
          [item.dateTimekeeping]: item
        }), {});
        this.isLoading = false;
        this.initListMonthSearch(startDate, endDate);
      },
      () => {
        this.isLoading = false;
      }
    );

    this.workCalendarService.getRecord(workCalendarId).subscribe((res: BaseResponse) => {
      this.workCalendars = res.data;
    });
    this.loadWorkCalendarDataSource(workCalendarId);
  }

  private initListMonthSearch(startDate: moment.Moment, endDate: moment.Moment): void {
    this.listMonth = [];
    for (let current = startDate.clone(); current.isSameOrBefore(endDate, 'month'); current.add(1, 'month')) {
      this.listMonth.push(current.format('MM/YYYY'));
    }
  }

  getYearList() {
    const listYear = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 50; i <= currentYear + 50; i++) {
      listYear.push(new CatalogModel(i.toString(), i));
    }
    return listYear;
  }

  onChangeWorkCalendar() {
    this.search();
  }

  onChangeYear() {
    this.search();
  }

  onListener() {
    this.closeStaffInfoSubscription = this.alertModalChangeService.closePersonalInfo$.subscribe((res) => {
      if (res) {
        this.search();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.closeStaffInfoSubscription) {
      this.closeStaffInfoSubscription.unsubscribe();
    }
  }

  getListWorkdayType() {
    this.subscriptions.push(
      this.dataService.getData(this.getUrlCategory(this.categoryCode.LICH_LAM_VIEC), this.microService.ADMIN, true).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listWorkdayType = res.data;
        }
      })
    );
  }
}

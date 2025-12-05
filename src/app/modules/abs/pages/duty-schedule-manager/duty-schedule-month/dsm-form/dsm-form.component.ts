import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { DutySchedulesModel } from '@app/modules/abs/data-access/models/duty-schedule-manager/duty-schedules.model';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { Constant } from '@app/modules/abs/data-access/constant/constant.class';
import { BaseResponse } from '@core/models/base-response';
import {
  DutyScheduleMonthService
} from '@app/modules/abs/data-access/services/duty-schedule-manager/duty-schedule-month.service';

@Component({
  selector: 'app-dsm-form',
  templateUrl: './dsm-form.component.html',
  styleUrls: ['./dsm-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsmFormComponent extends BaseFormComponent<DutySchedulesModel> implements OnInit, OnChanges {
  readonly FORM_ARRAY_NAME = 'listDutySchedule';
  dates: string[] = [];
  array = null;
  map: Map<string, number> = new Map<string, number>();
  constant = Constant;
  positionList: any[] = [];
  nzWidthConfig = [];
  dataValues: Map<string, any> = new Map<string, any>();

  @Input() monthValue: any = null;
  @Input() responseSearch: any = null;
  @Output() changedIndex = new EventEmitter<number>();


  constructor(
    private readonly service: DutyScheduleMonthService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'dutyScheduleId';
    this.initForm();
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: DutySchedulesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: DutySchedulesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  ngOnInit() {
    this.getData();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (this.monthValue && changes['responseSearch']) {
      this.isLoading = true;
      this.initializeDates();
      if (this.responseSearch?.listData) {
        const baseWidths = ['100px'];
        const middleWidths = Array(this.responseSearch?.listData.length * (this.positionList.length ?? 1)).fill('200px');
        this.nzWidthConfig = [...baseWidths, ...middleWidths];
      } else {
        this.nzWidthConfig = [];
      }
      this.ref.detectChanges();
      if (this.responseSearch) {
        this.patchValue(this.responseSearch);
        this.isLoading = false;
        this.ref.detectChanges();
      }
    }
  }

  patchValue(responseSearch: any) {
    this.dataValues = new Map<string, any>();
    for (let k = 0; k < this.dates.length; k++) {
      const dateValue = this.dates[k];
      for (let i = 0; i < responseSearch.listData.length; i++) {
        const dataParent = responseSearch.listData[i];
        for (let j = 0; j < this.positionList.length; j++) {
          const dataPosition = this.positionList[j];
          const dutyPosition = dataParent.dutyPositions?.find(it => it.dutyPositionId == dataPosition.value);
          let employeeIds = [];
          let dataSelect = [];
          if (dutyPosition) {
            const day = this.getDayWithoutLeadingZero(dateValue);
            dataSelect = dutyPosition.mapEmployeeBeans[day] ?? [];
            employeeIds = dataSelect?.map(it => it.employeeId) ?? [];
          }
          this.dataValues.set('employee-' + dateValue + '-' + dataParent.organizationId + '-' + dataPosition.value,
            {
              'dataSelect': dataSelect,
              'employeeIds': employeeIds,
              'organizationId': dataParent.organizationId,
              'dutyPositionId': dataPosition.value,
              'dateTimekeeping': this.parseDate(dateValue),
              'orderNumber': j + 1,
              'isFirst': true
            }
          );
        }
      }
    }
  }

  getDayWithoutLeadingZero(input: string): number {
    return parseInt(input.split('/')[0], 10);
  }

  getLabelData(dataSelect: any[]) {
    return dataSelect?.map(it => it.fullLabel).join(' - ');
  }


  getData() {
    this.dataService.getData(this.getUrlCategory(this.constant.CatalogType.ABS_VI_TRI_TRUC), this.microService.ADMIN, true).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.positionList = res.data;
      }
    });
  }


  initializeDates() {
    this.dates = [];
    let monthStart = new Date(this.monthValue.getFullYear(), this.monthValue.getMonth(), 1);
    const monthEnd = new Date(this.monthValue.getFullYear(), this.monthValue.getMonth() + 1, 0);
    let currentDate = new Date(monthStart);
    while (currentDate <= monthEnd) {
      this.dates.push(this.formatDate(currentDate));
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
    }
  }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    return `${day}/${month}`;
  }

  parseDate(dateStr: string): Date {
    const [dayStr, monthStr] = dateStr.split('/');
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    const year = this.monthValue.getFullYear();

    return new Date(year, month, day);
  }

  save() {
    if (!this.body) {
      this.body = {};
    }

    const filteredData = [...this.dataValues.values()].filter(item =>
      Array.isArray(item.employeeIds) && item.employeeIds.length > 0
    );

    if (filteredData.length > 0) {
      this.body.listData = filteredData;
    }

    this.body.listOrganizationId = this.responseSearch.listData.map(item => item?.organizationId);
    this.body.monthValue = new Date(this.monthValue.getFullYear(), this.monthValue.getMonth(), 1);
    this.createApi(this.body)
      .subscribe(
        (res: BaseResponse<any>) => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.changedIndex.emit(1);
            this.toast.success(
              this.translate.instant('common.notification.updateSuccess')
            );
          }
        }
      );

  }


}

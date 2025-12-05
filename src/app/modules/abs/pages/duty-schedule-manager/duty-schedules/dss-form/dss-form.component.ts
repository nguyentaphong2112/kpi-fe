import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { DutySchedulesModel } from '../../../../data-access/models/duty-schedule-manager/duty-schedules.model';
import { DutySchedulesService } from '../../../../data-access/services/duty-schedule-manager/duty-schedules.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { ActionSchema } from '@core/models/action.model';
import { Scopes } from '@core/utils/common-constants';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { Pagination } from '@shared/model/pagination';
import { Constant } from '@app/modules/abs/data-access/constant/constant.class';
import _ from 'lodash';
import { DataService } from '@shared/services/data.service';
import { BaseResponse } from '@core/models/base-response';
import { UrlConstant } from '@app/modules/abs/data-access/constant/url.class';


@Component({
  selector: 'dss-form',
  templateUrl: './dss-form.component.html',
  styleUrls: ['./dss-form.component.scss']
})
export class DssFormComponent extends BaseFormComponent<DutySchedulesModel> implements OnInit, OnChanges {
  readonly FORM_ARRAY_NAME = 'listDutySchedule';
  actionSchema: ActionSchema;
  scope = Scopes.VIEW;
  dates: string[] = [];
  pagination = new Pagination();
  constant = Constant;
  map: Map<string, number> = new Map<string, number>();
  mapCopy: Map<any, boolean> = new Map<any, boolean>();
  positionList: any[] = [];
  array = null;

  @Input() dateValue: any = null;
  @Input() responseSearch: any = null;
  @Input() organizationId = null;
  @Output() changedIndex = new EventEmitter<number>();

  constructor(
    private readonly service: DutySchedulesService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'dutyScheduleId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: DutySchedulesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: DutySchedulesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  ngOnInit() {
    this.initForm();
    this.getData();
    this.formArray.valueChanges.subscribe(() => {
      this.checkDuplicateDutyPosition();
    });
  }

  get formArray(): FormArray {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  override initForm() {
    this.form = this.fb.group({
      listDutySchedule: this.fb.array([])
    });
  }

  checkDuplicateDutyPosition() {
    const dutyArray = this.formArray.value;
    const seenEntries = new Map<string, number>();

    dutyArray.forEach((entry: any, index: number) => {
      const key = `${entry.organizationId}-${entry.dutyPositionId}`;
      const isDuplicate =
        entry.organizationName === null &&
        entry.dutyPositionId !== null &&
        seenEntries.has(key);

      if (isDuplicate) {
        this.formArray.at(index).get('dutyPositionId')?.setErrors({ duplicate: true });
        this.formArray.at(seenEntries.get(key)!).get('dutyPositionId')?.setErrors({ duplicate: true });
      } else if (entry.organizationName === null && entry.dutyPositionId !== null) {
        seenEntries.set(key, index);
        this.formArray.at(index).get('dutyPositionId')?.setErrors(null);
      }
    });
  }

  initFormArray(it?: any) {
    const controlsConfig: any = {};
    controlsConfig.dateValue = [this.dateValue ?? null];
    controlsConfig.dutyPositionId = [null];
    controlsConfig.organizationName = [it?.organizationName ?? null];
    controlsConfig.organizationId = [it?.organizationId ?? null];
    controlsConfig.orderNumber = [it?.orderNumber];
    for (let i = 0; i < 7; i++) {
      controlsConfig['employeeId' + i] = [[]];
      controlsConfig['isFirst' + i] = true;
      controlsConfig['dataSelect' + i] = [[]];
    }
    const profile = this.fb.group(controlsConfig);
    this.formArray.insert(it.index, profile);
  }

  onPageIndexChange(index: number) {
    this.changedIndex.emit(index);
  }

  getLabelData(dataSelect: any[]) {
    return dataSelect?.map(it => it.fullLabel).join(' - ');
  }


  ngOnChanges(changes: SimpleChanges) {
    if (this.dateValue && changes['responseSearch']) {
      this.array = Array(this.responseSearch.total).fill(0).map((_, index) => index + 1);
      this.resetForm();
      this.initializeDates();
      this.patchValue(this.responseSearch);
    }
  }


  patchValue(responseSearch: any) {
    responseSearch.listData.forEach((item: any, index) => {
      this.map.set(item.organizationName, 10 * (this.responseSearch.pageIndex - 1) + index);
      this.initFormArray({
        index: this.formArray.length,
        organizationId: item.organizationId,
        organizationName: item.organizationName,
        orderNumber: 0
      });
      if (item.dutyPositions.length == 0) {
        this.initFormArray({ index: this.formArray.length, organizationId: item.organizationId, orderNumber: 1 });
      }
      this.setValue(item);
    });
  }

  patchValueCopy(data: any, indexDate: number, indexDateCopy: number) {
    this.clearValue(indexDate);
    data.forEach((item: any) => {
      const dataArr = _.clone([...this.formArray.value]);
      const index = dataArr.findIndex(el => el.organizationId == item.organizationId) + 1;
      const orgLength = this.getOrgLength(item.organizationId);
      let isFind = false;
      for (let i = index; i < (orgLength + index); i++) {
        if (this.formArray.at(i).get('dutyPositionId').value == item.dutyPositionId) {
          this.setValueCopy(item, i, indexDate, indexDateCopy);
          isFind = true;
        }
      }
      if (!isFind) {
        const idx = dataArr.findIndex(el => el.organizationId == item.organizationId) + dataArr.filter(el => el.organizationId == item.organizationId).length;
        this.initFormArray({
          index: idx, organizationId: item.organizationId, orderNumber: orgLength,
          dateValue: this.formArray.at(0).get('dateValue').value
        });
        this.setValueCopy(item, idx, indexDate, indexDateCopy);
      }
    });
  }

  clearValue(indexEmployee: number) {
    this.formArray.controls.forEach((it: any) => {
      it.get(`employeeId${indexEmployee}`).setValue([]);
      it.get(`dataSelect${indexEmployee}`).setValue([]);
    });
  }

  resetForm() {
    while (this.formArray.length > 0) {
      this.formArray.removeAt(0);
    }
  }


  setValue(data: any) {
    data.dutyPositions.forEach((item: any) => {
      const dataArr = _.clone([...this.formArray.value]);
      const orgLength = this.getOrgLength(data.organizationId);
      const idx = dataArr.findIndex(el => el.organizationId == data.organizationId) + dataArr.filter(el => el.organizationId == data.organizationId).length;
      this.initFormArray({
        index: idx, organizationId: data.organizationId, orderNumber: orgLength,
        dateValue: this.formArray.at(0).get('dateValue').value
      });
      this.setEmployee(item, idx);
    });
  }


  setEmployee(item: any, index: number) {
    const formGroup = this.formArray.at(index);
    formGroup.get('dutyPositionId').setValue(item.dutyPositionId);
    for (let i = 0; i < 7; i++) {
      const employeeIds = item[`employeeId${i}`]?.map(it => it.employeeId) || [];
      formGroup.get(`employeeId${i}`).setValue(employeeIds);
      formGroup.get(`dataSelect${i}`).setValue(item[`employeeId${i}`]);
    }
  }

  setValueCopy(item: any, index: number, indexEmployee: number, indexDateCopy: number) {
    const formGroup = this.formArray.at(index);
    formGroup.get('dutyPositionId').setValue(item.dutyPositionId);
    const employeeIds = item[`employeeId${indexDateCopy}`]?.map(it => it.employeeId) || [];
    formGroup.get(`employeeId${indexEmployee}`).setValue(employeeIds);
    formGroup.get(`dataSelect${indexEmployee}`).setValue(item[`employeeId${indexDateCopy}`]);
  }

  setValueCopy2(indexEmployee: number, indexDateCopy: number) {
    this.formArray.controls.forEach((it: any) => {
      if (!this.arraysAreEqualUnordered(it.get(`employeeId${indexEmployee}`).value, it.get(`employeeId${indexDateCopy}`).value)) {
        this.mapCopy.set(it.get(`organizationId`).value + it.get('dutyPositionId').value + `employeeId${indexEmployee}`, true);
      }
      it.get(`employeeId${indexEmployee}`).setValue(it.get(`employeeId${indexDateCopy}`).value);
      it.get(`dataSelect${indexEmployee}`).setValue(it.get(`dataSelect${indexDateCopy}`).value);
    });
  }

  arraysAreEqualUnordered(arr1: any[], arr2: any[]): boolean {
    if (arr2.length == 0) {
      return true;
    }
    if (arr1.length !== arr2.length) {
      return false;
    }
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();
    return sortedArr1.every((value, index) => value === sortedArr2[index]);
  }


  getData() {
    this.dataService.getData(this.getUrlCategory(this.constant.CatalogType.ABS_VI_TRI_TRUC), this.microService.ADMIN, true).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.positionList = res.data;
      }
    });
  }

  add = (item: FormGroup) => {
    const data = _.clone(item.value);
    const orgLength = this.getOrgLength(data.organizationId);
    const dataArr = _.clone([...this.formArray.value]);
    // this.sort(dataArr);
    const index = dataArr.findIndex(el => el.organizationId == data.organizationId) + dataArr.filter(el => el.organizationId == data.organizationId).length;
    this.initFormArray({
      index,
      organizationId: data.organizationId,
      orderNumber: this.formArray.at(index - 1).get('orderNumber').value,
      dateValue: this.formArray.at(0).get('dateValue').value
    });
  };

  getOrgLength(organizationId: number) {
    const dataArr = _.clone([...this.formArray.value]);
    return dataArr.filter(el => el.organizationId == organizationId).length;
  }


  // sort(dataArr: any[]): void {
  //   dataArr.sort((a, b) => {
  //
  //     if (a.organizationId !== b.organizationId) {
  //       return a.organizationId - b.organizationId;
  //     }
  //     return a.orderNumber - b.orderNumber;
  //   });
  // }

  initializeDates() {
    this.dates = [];
    this.formArray.controls.forEach((it: any) => {
      it.get('dateValue').setValue(this.dateValue);
    });
    for (let i = 0; i < 7; i++) {
      const newDate = this.parseDate(this.dateValue);
      newDate.setDate(newDate.getDate() + i);
      this.dates.push(this.formatDate(newDate));
    }
  }

  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getListDate(date: any) {
    const dateCopy = [];
    for (let i = 1; i < 8; i++) {
      const newDate = this.parseDate(date);
      newDate.setDate(newDate.getDate() - i);
      dateCopy.push(this.formatDate(newDate));
    }
    return dateCopy;
  }

  calculateDaysBetween(date1: any, date2: any) {
    const [day1, month1, year1] = date1.split('/').map(Number);
    const [day2, month2, year2] = date2.split('/').map(Number);

    const firstDate = new Date(year1, month1 - 1, day1);
    const secondDate = new Date(year2, month2 - 1, day2);

    const timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return dayDifference;
  }

  copyValue(dateCopy: any, index: number, date: any) {
    const indexDateCopy = (index - this.calculateDaysBetween(dateCopy, date) + 7) % 7;
    if (this.parseDate(dateCopy) >= this.parseDate(this.dateValue)) {
      this.setValueCopy2(index, indexDateCopy);
    } else {
      const organizationIds = this.responseSearch.listData.map(item => item.organizationId);
      const data = {
        organizationId: this.organizationId,
        dateValue: dateCopy,
        listOrganizationId: organizationIds
      };
      this.service.getList(data, UrlConstant.DUTY_SCHEDULES.COPY_DATA).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.patchValueCopy(res.data, index, indexDateCopy);
        }
      });
    }
  }

  onDelete = (item: FormGroup, index: number) => {
    this.popupService.showModalConfirmDelete(() => {
      this.formArray.removeAt(index);
      const data = _.clone(item.value);
      if (this.getOrgLength(data.organizationId) == 1) {
        this.add(item);
      }
    });
  };

  save() {
    if (this.form.valid) {
      this.body = _.clone(this.form.value);
      if (!this.responseSearch) {
        return;
      }
      this.body.listOrganizationId = this.responseSearch.listData.map(item => item?.organizationId);
      this.body.dateValue = this.formArray.at(0).get('dateValue').value;
      this.body.listDutySchedule = this.body.listDutySchedule.filter(it => it.dutyPositionId != null);
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
}



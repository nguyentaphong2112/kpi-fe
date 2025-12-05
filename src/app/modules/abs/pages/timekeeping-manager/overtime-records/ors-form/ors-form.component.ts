import {Component, Injector, OnInit} from '@angular/core';
import {FormArray, ValidatorFn, Validators} from "@angular/forms";
import {OvertimeRecordsModel} from "../../../../data-access/models/timekeeping-manager/overtime-records.model";
import {OvertimeRecordsService} from "../../../../data-access/services/timekeeping-manager/overtime-records.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE, SYSTEM_FORMAT_DATA} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {Mode, REQUEST_TYPE} from "@shared/constant/common";
import * as moment from "moment/moment";
import {DateUtils} from "@shared/utils/date-utils.class";
import {Utils} from "@core/utils/utils";

@Component({
  selector: 'ors-form',
  templateUrl: './ors-form.component.html',
  styleUrls: ['./ors-form.component.scss']
})
export class OrsFormComponent extends BaseFormComponent<OvertimeRecordsModel> implements OnInit {

  serviceName = MICRO_SERVICE.ABS
  urlLoadData = '/overtime-records'
  constructor(
    private readonly service: OvertimeRecordsService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'overtimeRecordId'
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: OvertimeRecordsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: OvertimeRecordsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      employeeId: [null, [Validators.required]],
      dateTimekeeping: [null, [Validators.required]],
        listRecords: this.fb.array([
          this._createRecord(null)
        ], {
          validators: [this.validatorFormReason()]
        }),

    },
    {validators:
        []
    });
  }

  override beforeSave() {
    super.beforeSave();
    const formValue = this.form.value;

    // Extract the dateTimekeeping value
    const dateTimekeeping = formValue.dateTimekeeping;

    // Process records to combine dateTimekeeping with startTime and endTime
    const records = formValue.listRecords.map((record: any) => {
      return {
        ...record,
        startTime: this.combineDateAndTime(dateTimekeeping, record.startTime),
        endTime: this.combineDateAndTime(dateTimekeeping, record.endTime),
      };
    });

    const convertedData = {
      id:this.body.id,
      ...formValue,
      listRecords: records,
    };

    this.body = convertedData

  }

  combineDateAndTime(date: Date, time: Date): any {
    const hours = time.getHours();
    const minutes = time.getMinutes()
    const combined = moment(date).set({ hour: hours, minute: minutes, second: 0 });
    return Utils.convertDateToSendServer(combined.toDate(),SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT) ;

  }

  _createRecord(data: any) {
    const record = this.fb.group({
      overtimeTypeId: [data?.overtimeTypeId, [Validators.required]],
      startTime: [data?.startTime, [Validators.required]],
      endTime: [data?.endTime, [Validators.required]],
      overtimeRecordId:[data?.overtimeRecordId],
      content:[data?.content, [Validators.required]]
    }, {
      validators: [DateValidator.validateTwoDateTime('startTime', 'endTime')]
    });
    if (data) {
      record.patchValue(data);
    }
    return record;
  }

  get records() {
    return this.f['listRecords'] as FormArray;
  }

  addRecord() {
    this.records.push(this._createRecord(null))
  }


  removeRecord(index: number) {
    if (this.records.length > 1)
      this.records.removeAt(index);
    else {
      this.records.removeAt(index);
      this.addRecord();
    }
  }


  _isDuplicate(value1: any, value2: any) {
    if (value1.startTime && value1.endTime && value2.startTime && value2.endTime) {
      const from1 = moment(value1.startTime, SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT).toDate().getTime();
      const to1 = moment(value1.endTime, SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT).toDate().getTime();
      const from2 = moment(value2.startTime, SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT).toDate().getTime();
      const to2 = moment(value2.endTime, SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT).toDate().getTime();
      return !(from2 >= to1 || to2 <= from1);
    }
    return false;
  }

  validatorFormReason(): ValidatorFn | any {
    return (formArray: FormArray): { [key: string]: string } | null => {
      const rowNum = formArray.controls.length;
      const check = [];
      const isFail = [];
      for (let index = 0; index < rowNum; index++) {
        check[index] = false;
        isFail[index] = false;
      }
      for (let i = 0; i < rowNum - 1; i++) {
        if (!check[i]) {
          check[i] = true;
          for (let j = i + 1; j < rowNum; j++) {
            if (this._isDuplicate(formArray.controls[i].value, formArray.controls[j].value)) {
              check[j] = true;
              isFail[i] = true;
              isFail[j] = true;
              formArray.controls[i].get('startTime')?.setErrors({ 'duplicateTime': true });
              formArray.controls[i].get('endTime')?.setErrors({ 'duplicateTime': true });
              formArray.controls[j].get('startTime')?.setErrors({ 'duplicateTime': true });
              formArray.controls[j].get('endTime')?.setErrors({ 'duplicateTime': true });
            } else {
              if (!isFail[i]) {
                formArray.controls[i].get('startTime')?.setErrors(null);
                formArray.controls[i].get('endTime')?.setErrors(null);
                if (!formArray.controls[i].get('startTime')?.value) {
                  formArray.controls[i].get('startTime')?.setErrors({ 'required': true });
                }
                if (!formArray.controls[i].get('endTime')?.value) {
                  formArray.controls[i].get('endTime')?.setErrors({ 'required': true });
                }
              }
              if (!isFail[j]) {
                formArray.controls[j].get('startTime')?.setErrors(null);
                formArray.controls[j].get('endTime')?.setErrors(null);
                if (!formArray.controls[j].get('startTime')?.value) {
                  formArray.controls[j].get('startTime')?.setErrors({ 'required': true });
                }
                if (!formArray.controls[j].get('endTime')?.value) {
                  formArray.controls[j].get('endTime')?.setErrors({ 'required': true });
                }
              }
            }
          }
        }
      }
      return null;
    }
  }

  afterPatchValue() {

    super.afterPatchValue();
    while (this.records.length > 0) {
      this.records.removeAt(0);
    }
    this.data.listRecords?.forEach(item => {
      item.startTime = Utils.convertDateToFillForm(item.startTime, 'dd/MM/yyyy HH:mm');
      item.endTime = Utils.convertDateToFillForm(item.endTime, 'dd/MM/yyyy HH:mm');
      this.records.push(this._createRecord(item))
    })
  }


  protected readonly Mode = Mode;
  protected readonly CommonUtils = CommonUtils;
}



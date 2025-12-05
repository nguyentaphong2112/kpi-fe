import {Component, Injector, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {RequestsModel} from "../../../../data-access/models/request-manager/requests.model";
import {RequestsService} from "../../../../data-access/services/request-manager/requests.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE, SYSTEM_FORMAT_DATA} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {Mode, REQUEST_TYPE} from "@shared/constant/common";
import * as moment from "moment";
import {forkJoin, Subscription} from "rxjs";
import {Constant} from "@app/modules/abs/data-access/constant/constant.class";
import {BaseResponse} from "@shared/data-access";
import {NzUploadFile} from "ng-zorro-antd/upload";
import {Utils} from "@core/utils/utils";
import {SelectModal} from "@shared/component/hbt-select/select.component";
import {NzSafeAny} from "ng-zorro-antd/core/types";

@Component({
  selector: 'requests-form',
  templateUrl: './requests-form.component.html',
  styleUrls: ['./requests-form.component.scss']
})
export class RequestsFormComponent extends BaseFormComponent<any> implements OnInit {

  serviceName = MICRO_SERVICE.ABS
  urlLoadData = '/requests'
  listReason = [];
  subs: Subscription[] = [];
  requestId: number;
  fileList: NzUploadFile[] = [];


  @Input() data: any;

  constructor(
    private readonly service: RequestsService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'requestId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (formData: RequestsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(formData), REQUEST_TYPE.FORM_DATA_FILE);
    this.updateApi = (formData: RequestsModel) => this.service.update(CommonUtils.convertDataSendToServer(formData), REQUEST_TYPE.FORM_DATA_FILE);


  }

  override initForm() {
    this.form = this.fb.group({
      employeeId: [null, [Validators.required]],
      note: [null, [Validators.maxLength(500)]],
      reason:[null, [Validators.maxLength(500)]],
      listAbsRequest: this.fb.array([
        this._createReason(null)
      ], {
        validators: [this.validatorFormReason()]
      }),

      fileRequest: [null],
    },
    {validators:
        []
    });

  }



  ngOnInit() {
    super.ngOnInit();
    this.getListReasonLeave();
  }

  onCustomerSelect(event: NzSafeAny) {
   console.log(event);
  }

  _createReason(data: any) {
    const reason = this.fb.group({
      reasonTypeId: [data?.reasonTypeId, [Validators.required]],
      startTime: [data?.startTime, [Validators.required]],
      endTime: [data?.endTime, [Validators.required]],
      requestId:[data?.requestId]
    }, {
      validators: [DateValidator.validateTwoDateTime('startTime', 'endTime')]
    });
    if (data) {
      reason.patchValue(data);
    }
    return reason;
  }

  get reasons() {
    return this.f['listAbsRequest'] as FormArray;
  }

  addReason() {
    this.reasons.push(this._createReason(null))
  }


  removeReason(index: number) {
    if (this.reasons.length > 1)
      this.reasons.removeAt(index);
    else {
      this.reasons.removeAt(index);
      this.addReason();
    }
  }

  getListReasonLeave() {
    this.subs.push(
        this.service.getAllReasonLeaves().subscribe(res => {
          const response: BaseResponse = res;
          this.listReason = response.data;
        })
    );
  }

  afterPatchValue() {

    super.afterPatchValue();
    while (this.reasons.length > 0) {
      this.reasons.removeAt(0);
    }
    this.data.listAbsRequest?.forEach(item => {
      item.startTime = Utils.convertDateToFillForm(item.startTime, 'dd/MM/yyyy HH:mm');
      item.endTime = Utils.convertDateToFillForm(item.endTime, 'dd/MM/yyyy HH:mm');
      this.reasons.push(this._createReason(item))
    })
    const files = this.data.fileRequest?.map(item => {
      return {
        uid: item.attachmentId,
        name: item.fileName,
        checkSum: item.checkSum,
        status: 'done'
      };
    });
    this.f.fileRequest.setValue(files);
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

  beforeSave() {
    const data = this.form.value;
    delete data?.files;
    this.body = {
      id: this.body.id,
      data: {...data, attachmentDeleteIds: this.docIdsDelete},
      fileRequest:  this.form.value.fileRequest?.filter(item => item instanceof File)
    };


  }


  protected readonly Mode = Mode;
}



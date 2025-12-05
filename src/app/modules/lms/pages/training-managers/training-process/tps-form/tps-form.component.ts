import { Component, Injector, OnInit } from '@angular/core';
import { AbstractControl, FormArray, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TrainingProcessModel } from '../../../../data-access/models/training-managers/training-process.model';
import { TrainingProcessService } from '../../../../data-access/services/training-managers/training-process.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { Scopes } from '@core/utils/common-constants';
import { DataService } from '@shared/services/data.service';
import { Constant } from '@app/modules/lms/data-access/constants/constants';

export function validateTotalBudget(listSource: any[]): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const totalBudget = formGroup.get('totalBudget')?.value || 0;
    let total = 0;

    listSource.forEach(item => {
      const value = formGroup.get(item.value)?.value || 0;
      total += +value;
    });

    return total == totalBudget
      ? null
      : { totalBudgetMismatch: true };
  };
}

@Component({
  selector: 'tps-form',
  templateUrl: './tps-form.component.html',
  styleUrls: ['./tps-form.component.scss']
})
export class TpsFormComponent extends BaseFormComponent<TrainingProcessModel> implements OnInit {

  scope: string = Scopes.VIEW;
  functionCodeEmployee = Constant.FUNCTION_CODE.TRAINING_PROCESS;
  serviceName = MICRO_SERVICE.LMS;
  listSource: any[] = [];

  constructor(
    private readonly service: TrainingProcessService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'trainingProcessId';
    this.initDataSelect();
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: TrainingProcessModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE);
    this.updateApi = (body: TrainingProcessModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'lms_training_process'
    });
    this.getConfigAttributes();
  }

  initDataSelect() {
    this.subscriptions.push(
      this.dataService.getData(this.getUrlCategory(this.categoryCode.LMS_NGUON_KINH_PHI), this.microService.ADMIN).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listSource = res.data;
          this.listSource.forEach(item => {
            this.form.addControl(item.value, this.fb.control(null));
          });
          this.updateValidators();
        }
      })
    );
  }

  updateValidators() {
    this.form.setValidators([
      validateTotalBudget(this.listSource)
    ]);
    this.form.updateValueAndValidity();
  }

  override initForm() {
    this.form = this.fb.group({
        trainingProcessId: [null],
        employeeId: [null, [Validators.required]],
        startDate: [null, [Validators.required]],
        endDate: [null],
        majorId: [null, [Validators.required]],
        trainingPlaceId: [null, [Validators.required]],
        trainingPlanId: [null],
        trainingCourseId: [null],
        documentNo: [null],
        documentSignedDate: [null],
        totalBudget: [null],
        totalHours: [null, [Validators.required]],
        files: [null],
        listAttributes: this.fb.array([])
      },
      {
        validators:
          [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError'),
            validateTotalBudget(this.listSource)]
      });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  patchValueInfo() {
    this.form.patchValue(this.data);
    this.afterPatchValue();
    this.data.budgetsList.forEach(item => {
      this.f[item.budgetTypeId].setValue(item.amount);
    });
    const files = this.data.attachFileList?.map(item => {
      return {
        uid: item.attachmentId,
        name: item.fileName,
        checkSum: item.checkSum,
        status: 'done'
      };
    });
    this.f.files.setValue(files);
  }


  beforeSave() {
    const data = this.form.value;
    data.budgetsList = this.listSource.map(it => {
      return {
        budgetTypeId: it.value,
        amount: this.f[it.value].value
      };
    });
    this.body = {
      id: this.body.trainingProcessId,
      data: { ...data, attachmentDeleteIds: this.docIdsDelete },
      files: this.f.files.value?.filter(item => item instanceof File)
    };
  }
}



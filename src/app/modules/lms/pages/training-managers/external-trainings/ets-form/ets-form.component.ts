import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { ExternalTrainingsModel } from '../../../../data-access/models/training-managers/external-trainings.model';
import {
  ExternalTrainingsService
} from '../../../../data-access/services/training-managers/external-trainings.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { DataService } from '@shared/services/data.service';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { format, parse } from 'date-fns';
import { Scopes } from '@core/utils/common-constants';
import { Constant } from '@app/modules/lms/data-access/constants/constants';
import { FunctionCode } from '@shared/enums/enums-constant';

@Component({
  selector: 'ets-form',
  templateUrl: './ets-form.component.html',
  styleUrls: ['./ets-form.component.scss']
})
export class EtsFormComponent extends BaseFormComponent<ExternalTrainingsModel> implements OnInit {
  scope = Scopes.VIEW;
  functionCode = Constant.FUNCTION_CODE.EXTERNAL_TRAINING;
  functionCodeEmployee = Constant.FUNCTION_CODE.EXTERNAL_TRAINING;

  constructor(
    private readonly service: ExternalTrainingsService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'externalTrainingId';

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: ExternalTrainingsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: ExternalTrainingsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'lms_external_trainings'
    });
    this.getConfigAttributes();
  }

  override initForm() {
    this.form = this.fb.group({
        externalTrainingId: [null],
        typeId: [null, [Validators.required]],
        fullName: [null, [Validators.required]],
        genderId: [null, [Validators.required]],
        yearOfBirth: [null, [Validators.required, DateValidator.maxCurrentDateValidator]],
        mobileNumber: [null],
        startDate: [null, [Validators.required]],
        endDate: [null],
        personalIdNo: [null],
        address: [null],
        organizationAddress: [null, [Validators.required]],
        trainningTypeId: [null, [Validators.required]],
        trainingMajorId: [null, [Validators.required]],
        organizationId: [null],
        content: [null],
        mentorId: [null],
        certificateNo: [null],
        certificateDate: [null],
        admissionResults: [null],
        graduatedResults: [null],
        numberOfLessons: [null],
        tuitionFeeStatusId: [null],
        listAttributes: this.fb.array([])
      },
      {
        validators:
          [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
      });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  beforeSave() {
    const formattedYear = format(this.f.yearOfBirth.value, 'yyyy');
    this.body.yearOfBirth = formattedYear.toString();
  }

  afterPatchValue() {
    const yearOfBirth = parse(this.data.yearOfBirth, 'yyyy', new Date());
    this.f.yearOfBirth.setValue(yearOfBirth);
    super.afterPatchValue();
  }
}



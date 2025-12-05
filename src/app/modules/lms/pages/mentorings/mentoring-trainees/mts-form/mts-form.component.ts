import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { MentoringTraineesModel } from '../../../../data-access/models/mentorings/mentoring-trainees.model';
import { MentoringTraineesService } from '../../../../data-access/services/mentorings/mentoring-trainees.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { FunctionCode } from '@shared/enums/enums-constant';
import { Scopes } from '@core/utils/common-constants';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'mts-form',
  templateUrl: './mts-form.component.html',
  styleUrls: ['./mts-form.component.scss']
})
export class MtsFormComponent extends BaseFormComponent<MentoringTraineesModel> implements OnInit {
  functionCodeEmployee = FunctionCode.HR_PERSONAL_INFO;
  scope: string = Scopes.VIEW;
  serviceName = MICRO_SERVICE.LMS;

  constructor(
    private readonly service: MentoringTraineesService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'medMentoringTraineeId';

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: MentoringTraineesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE);
    this.updateApi = (body: MentoringTraineesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'med_mentoring_trainees'
    });
    this.isPage = false;
    this.getConfigAttributes();
  }


  override initForm() {
    this.form = this.fb.group({
        medMentoringTraineeId: [null],
        documentNo: [null],
        employeeId: [null, [Validators.required]],
        startDate: [null, [Validators.required]],
        endDate: [null, [Validators.required]],
        projectId: [null, [Validators.required]],
        hospitalId: [null, [Validators.required]],
        totalLessons: [null],
        content: [null, [Validators.required]],
        files: [null],
        listAttributes: this.fb.array([])
      },
      {
        validators:
          [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
      });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  patchValueInfo() {
    this.form.patchValue(this.data);
    this.afterPatchValue();
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
    this.body = {
      id: this.body.medMentoringTraineeId,
      data: { ...data, attachmentDeleteIds: this.docIdsDelete },
      files: this.f.files.value?.filter(item => item instanceof File)
    };
  }
}



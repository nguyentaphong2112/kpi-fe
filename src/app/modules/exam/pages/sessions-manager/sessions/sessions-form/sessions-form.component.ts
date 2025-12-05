import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { SessionsModel } from '../../../../data-access/models/sessions-manager/sessions.model';
import { SessionsService } from '../../../../data-access/services/sessions-manager/sessions.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE, SYSTEM_FORMAT_DATA } from '@core/constant/system.constants';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { Constant } from '@app/modules/exam/data-access/constants/constants';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { Utils } from '@core/utils/utils';

@Component({
  selector: 'sessions-form',
  templateUrl: './sessions-form.component.html',
  styleUrls: ['./sessions-form.component.scss']
})
export class SessionsFormComponent extends BaseFormComponent<SessionsModel> implements OnInit {
  CONSTANT = Constant.NAME_STEPS;
  serviceName = MICRO_SERVICE.EXAM;
  currentStep = this.CONSTANT.STEP_1;
  steps = [
    {
      stepCode: this.CONSTANT.STEP_1,
      stepName: 'Thông tin chung'
    },
    {
      stepCode: this.CONSTANT.STEP_2,
      stepName: 'Cấu hình thời gian'
    },
    {
      stepCode: this.CONSTANT.STEP_3,
      stepName: 'Đối tượng tham gia'
    },
    {
      stepCode: this.CONSTANT.STEP_4,
      stepName: 'Quy tắc và giám sát'
    },
    {
      stepCode: this.CONSTANT.STEP_5,
      stepName: 'Sau khi thi'
    }
  ];
  isShow = true;

  mapStepForm = new Map<number, FormGroup>();

  constructor(injector: Injector,
              private service: SessionsService) {
    super(injector);
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: any) => this.service.createOrImport(body, REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: any) => this.service.createOrImport(body, REQUEST_TYPE.FORM_DATA);
    this.isPage = true;
    this.key = 'sessionId';
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.mode != Mode.ADD) {
      this.isShow = false;
    }
  }

  initForm() {
    this.form = this.fb.group({
      sessionId: null,
      info: this.fb.group({
        name: [null, Validators.required],
        code: [null, Validators.required],
        examPaperIds: [null, Validators.required],
        semester: [null, Validators.required],
        year: [null, Validators.required],
        subjectCode: [null, Validators.required],
        topicCode: [null, Validators.required],
        examTypeCode: [null, Validators.required],
        modeCode: [null, Validators.required],
        totalQuestions: [null, Validators.required],
        totalScore: [100],
        description: [null],
        statusCode: ['DRAFT', Validators.required]
      }),
      time: this.fb.group({
        startTime: [null, Validators.required],
        endTime: [null, Validators.required],
        durationMinutes: [null, Validators.required],
        allowLateMinutes: null
      }, {
        validators: [DateValidator.validateRangeDate('startTime', 'endTime', 'rangeDateError')]
      }),
      participants: this.fb.group({
        files: [[]],
        docIdsDelete: null
      }),
      rules: this.fb.group({
        allowRetakes: ['N', Validators.required],
        maxAttempts: null,
        randomizeQuestions: ['Y', Validators.required],
        randomizeOptions: ['Y', Validators.required],
        password: null,
        visibilityCode: ['PRIVATE', Validators.required],
        requireWebcam: ['N', Validators.required]
      }),
      afterSubmit: this.fb.group({
        showResultAfterSubmit: ['Y', Validators.required],
        showCorrectAnswers: ['Y', Validators.required]
      })
    });
    this.mapStepForm.set(0, this.info);
    this.mapStepForm.set(1, this.time);
    this.mapStepForm.set(2, this.participants);
    this.mapStepForm.set(3, this.rules);
    this.mapStepForm.set(4, this.afterSubmit);
  }

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get time(): FormGroup {
    return this.form.get('time') as FormGroup;
  }

  get participants(): FormGroup {
    return this.form.get('participants') as FormGroup;
  }

  get rules(): FormGroup {
    return this.form.get('rules') as FormGroup;
  }

  get afterSubmit(): FormGroup {
    return this.form.get('afterSubmit') as FormGroup;
  }

  patchValueInfo() {
    this.data.startTime = Utils.convertDateToFillForm(this.data.startTime, SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT);
    this.data.endTime = Utils.convertDateToFillForm(this.data.endTime, SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT);
    this.f['sessionId'].setValue(this.data.sessionId);
    this.info.patchValue(this.data);
    this.time.patchValue(this.data);
    this.rules.patchValue(this.data);
    this.afterSubmit.patchValue(this.data);
    if (this.data?.attachFileList) {
      this.data.attachFileList?.forEach((item: any) => {
        this.participants.controls['files'].value.push({
          uid: item.attachmentId,
          name: item.fileName,
          checkSum: item.checkSum,
          status: 'done'
        });
      });
    }
    this.isShow = true;
  }

  continual() {
    this.isSubmitted = true;
    const isNext = this.mapStepForm.get(this.steps.findIndex(el => el.stepCode === this.currentStep))?.valid ||
      this.mapStepForm.get(this.steps.findIndex(el => el.stepCode === this.currentStep))?.disabled;
    if (isNext || this.mode === Mode.VIEW) {
      this.isSubmitted = false;
      this.currentStep = this.steps[this.steps.findIndex(el => el.stepCode === this.currentStep) + 1].stepCode;
    }
  }

  toBack() {
    this.currentStep = this.steps[this.steps.findIndex(el => el.stepCode === this.currentStep) - 1].stepCode;
    this.isSubmitted = false;
  }

  beforeSave() {
    this.body = {
      sessionId: this.f['sessionId'].value,
      ...this.f['info'].value,
      ...this.f['time'].value,
      ...this.f['participants'].value,
      ...this.f['rules'].value,
      ...this.f['afterSubmit'].value,
      startTime: Utils.convertDateToSendServer(this.time.controls['startTime'].value, SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT),
      endTime: Utils.convertDateToSendServer(this.time.controls['endTime'].value, SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT),
      files: this.participants.controls['files'].value.find(item => item instanceof File) || null
    };
  }
}



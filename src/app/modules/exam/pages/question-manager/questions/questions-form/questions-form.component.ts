import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionsModel } from '../../../../data-access/models/question-manager/questions.model';
import { QuestionsService } from '../../../../data-access/services/question-manager/questions.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { Constant } from '@app/modules/exam/data-access/constants/constants';

@Component({
  selector: 'questions-form',
  templateUrl: './questions-form.component.html',
  styleUrls: ['./questions-form.component.scss']
})
export class QuestionsFormComponent extends BaseFormComponent<QuestionsModel> implements OnInit {
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
      stepName: 'Nội dung câu hỏi'
    },
    {
      stepCode: this.CONSTANT.STEP_3,
      stepName: 'Phần đáp án'
    }
  ];

  disableButton = true;
  rememberData: any = {};

  continue = true;
  continue2 = false;
  continue3 = false;

  urlLoadData = '/questions';

  subjectCodeData: any;
  topicCodeData: any;
  typeCodeData: any;
  sectionCodeData: any;
  levelCodeData: any;
  questionGroupIdData: any;

  mapStepForm = new Map<number, FormGroup>();

  constructor(
    private readonly service: QuestionsService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'questionId';

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: QuestionsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: QuestionsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
        questionId: [null],
        code: [null, [Validators.required, Validators.maxLength(50)]],
        subjectCode: [null, [Validators.required, Validators.maxLength(20)]],
        topicCode: [null, [Validators.required, Validators.maxLength(20)]],
        typeCode: [null, [Validators.required, Validators.maxLength(20)]],
        sectionCode: [null, [Validators.required, Validators.maxLength(20)]],
        levelCode: [null, [Validators.required, Validators.maxLength(20)]],
        skillType: [null, [Validators.required, Validators.maxLength(20)]],
        questionGroupId: [null, [Validators.required]],
        orderNumber: [null, [Validators.required]],
        defaultScore: [null, [Validators.required]],
        defaultWeight: [null, [Validators.required]],
        timeSuggestedSeconds: [null, [Validators.required]],
        content: [null, [Validators.required]],
        explanation: [null, [Validators.required]],
        solution: [null, [Validators.required]],
        statusCode: [null, [Validators.required]],
        fileList: [null]
      },
      {
        validators:
          []
      });
    this.subjectCodeData = [
      { id: 'MATH101', name: 'Toán cao cấp 1' },
      { id: 'PHYS201', name: 'Vật lý đại cương' },
      { id: 'CHEM110', name: 'Hoá học cơ bản' },
      { id: 'ENG301', name: 'Tiếng Anh chuyên ngành' },
      { id: 'IT102', name: 'Nhập môn Lập trình' }
    ];
    this.topicCodeData = [
      { id: 'ALG', name: 'Đại số tuyến tính' },
      { id: 'CALC', name: 'Giải tích' },
      { id: 'MECH', name: 'Cơ học cổ điển' },
      { id: 'GRAM', name: 'Ngữ pháp tiếng Anh' },
      { id: 'PROG', name: 'Lập trình hướng đối tượng' }
    ];
    this.typeCodeData = [
      { id: 'MCQ', name: 'Trắc nghiệm' },
      { id: 'ESSAY', name: 'Tự luận' },
      { id: 'MATCHING', name: 'Ghép cặp' },
      { id: 'TRUEFALSE', name: 'Đúng/Sai' },
      { id: 'FILLBLANK', name: 'Điền khuyết' }
    ];

    this.sectionCodeData = [
      { id: 'SEC1', name: 'Phần 1 - Cơ bản' },
      { id: 'SEC2', name: 'Phần 2 - Nâng cao' },
      { id: 'SEC3', name: 'Phần 3 - Ôn tập' },
      { id: 'SEC4', name: 'Phần 4 - Thực hành' }
    ];

    this.levelCodeData = [
      { id: 'EASY', name: 'Dễ' },
      { id: 'MEDIUM', name: 'Trung bình' },
      { id: 'HARD', name: 'Khó' },
      { id: 'ADVANCED', name: 'Nâng cao' }
    ];

    this.questionGroupIdData = [
      { id: 'GROUP1', name: 'Nhóm câu hỏi Toán học' },
      { id: 'GROUP2', name: 'Nhóm câu hỏi Khoa học' },
      { id: 'GROUP3', name: 'Nhóm câu hỏi Ngôn ngữ' },
      { id: 'GROUP4', name: 'Nhóm câu hỏi Kỹ năng mềm' }
    ];
  }

  onBack() {
    if (this.continue) {
      this.disableButton = true;
    } else if (this.continue2) {
      if (this.form.get('content')?.value != null && this.form.get('content')?.value.trim() != '') {
        this.rememberData.content = this.form.get('content')?.value;
      }
      if (this.form.get('explanation')?.value != null && this.form.get('explanation')?.value.trim() != '') {
        this.rememberData.explanation = this.form.get('explanation')?.value;
      }
      this.form.get('content')?.reset();
      this.form.get('explanation')?.reset();
      this.continue = true;
      this.continue2 = false;
      this.continue3 = false;
      this.disableButton = true;
      this.currentStep = this.CONSTANT.STEP_1;
    } else if (this.continue3) {
      this.continue = false;
      this.continue2 = true;
      this.continue3 = false;
      this.disableButton = false;
      this.rememberData.solution = this.form.get('solution')?.value;
      this.form.get('solution')?.reset();
      this.currentStep = this.CONSTANT.STEP_2;
    }
  }

  onContinue() {
    const group1 = [
      'subjectCode', 'typeCode', 'sectionCode',
      'skillType', 'orderNumber', 'defaultScore',
      'defaultWeight'
    ];
    const group2 = ['content', 'solution'];
    const hasValues = (keys: string[]) =>
      keys.every(key => {
        const value = this.form.get(key)?.value;
        return value != null && value.toString().trim() !== '';
      });

    const isEmpty = (keys: string[]) =>
      keys.every(key => {
        const value = this.form.get(key)?.value;
        return value == null || value.toString().trim() === '';
      });
    if (hasValues(group1) && isEmpty(group2)) {
      this.continue = false;
      this.continue2 = true;
      this.continue3 = false;
      if (this.rememberData.content) {
        this.form.get('content')?.setValue(this.rememberData.content);
      } else {
        this.form.get('content')?.reset();
      }
      if (this.rememberData.explanation) {
        this.form.get('explanation')?.setValue(this.rememberData.explanation);
      } else {
        this.form.get('explanation')?.reset();
      }
      this.currentStep = this.CONSTANT.STEP_2;
      this.disableButton = false;
    } else if (hasValues([...group1, 'content']) && this.form.controls['solution']?.value == null) {
      this.continue = false;
      this.continue2 = false;
      this.continue3 = true;
      if (this.rememberData.solution) {
        this.form.get('solution')?.setValue(this.rememberData.solution);
      }
      this.currentStep = this.CONSTANT.STEP_3;
    } else if (hasValues([...group1, ...group2])) {}
  }

}



import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { TrainingProgramsModel } from '../../../../data-access/models/training-managers/training-programs.model';
import { TrainingProgramsService } from '../../../../data-access/services/training-managers/training-programs.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { DataService } from '@shared/services/data.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';

@Component({
  selector: 'tps-form',
  templateUrl: './tps-form.component.html',
  styleUrls: ['./tps-form.component.scss']
})
export class TpsFormComponent extends BaseFormComponent<TrainingProgramsModel> implements OnInit {
  readonly FORM_ARRAY_NAME = 'courses';
  actionSchema: ActionSchema;
  isSubmitted2 = false;

  constructor(
    private readonly service: TrainingProgramsService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'trainingProgramId';
    this.initAction();
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: TrainingProgramsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: TrainingProgramsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'crm_training_programs'
    });
    this.getConfigAttributes();
  }

  get courses(): NzSafeAny {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.add',
          icon: 'plus-circle',
          function: this.add
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          // isShowFn: this.isShowDelete,
          function: this.onDelete
        })
      ]
    });
  }


  override initForm() {
    this.form = this.fb.group({
      trainingProgramId: [null],
      title: [null, [Validators.required]],
      listAttributes: this.fb.array([]),
      courses: this.fb.array([])
    });
    if (this.mode === Mode.ADD) {
      this.initCourses();
    }
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  add = () => {
    this.isSubmitted2 = true;
    if (this.courses.valid) {
      this.initCourses();
      this.isSubmitted2 = false;
    }
  };

  onDelete = (data: FormGroup) => {
    this.popupService.showModalConfirmDelete(() => {
      this.courses.removeAt(data['key']);
      if (this.courses.length === 0) {
        this.initCourses();
      }
    });
  };

  initCourses = () => {
    const controlsConfig: any = {};
    controlsConfig.day = [null];
    controlsConfig.content = [null, Validators.required];
    const courses = this.fb.group(controlsConfig);
    this.courses.push(courses);
  };

  beforeSave() {
    this.courses.controls.forEach((course: any, index: number) => {
      course.get('day').setValue(index + 1);
    });
    this.body.lessons = JSON.stringify(this.courses.value);
  }

  afterPatchValue() {
    super.afterPatchValue();
    if (this.data) {
      this.data.lessons = JSON.parse(this.data.lessons);
      this.data.lessons.forEach((it, index) => {
        this.initCourses();
        this.courses.controls[index].setValue({
          day: it.day || null,
          content: it.content || null
        });
      });
    }
  }
}



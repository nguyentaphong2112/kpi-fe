import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CoursesService } from '@app/modules/crm/data-access/services/training-managers/courses.service';
import { CoursesModel } from '@app/modules/crm/data-access/models/training-managers/courses.model';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { CourseLessonsService } from '@app/modules/crm/data-access/services/training-managers/course-lessons.service';
import { UrlConstant } from '@app/modules/crm/data-access/constants/url.class';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { BaseResponse } from '@core/models/base-response';
import _ from 'lodash';

@Component({
  selector: 'app-scores-form',
  templateUrl: './scores-form.component.html',
  styleUrls: ['./scores-form.component.scss']
})
export class ScoresFormComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  readonly FORM_ARRAY_NAME = 'listLessonResult';

  constructor(
    private readonly service: CoursesService,
    private readonly lessonService: CourseLessonsService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'courseId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: CoursesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, UrlConstant.COURSES.SAVE_LESSON_RESULT);
    this.updateApi = (body: CoursesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
  }

  ngOnInit() {
    this.mode = this.modeConst.ADD;
    this.initLessons();
    this.initForm();
  }

  get scores(): NzSafeAny {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  override initForm() {
    this.form = this.fb.group({
      listLessonResult: this.fb.array([])
    });
  }

  getData(listCourseLessonId: any) {
    this.service.getList({ listCourseLessonId: listCourseLessonId }, UrlConstant.COURSES.SAVE_LESSON_RESULT + '/' + this.data.traineeId).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        res.data.forEach(item => {
          this.scores.controls.forEach((scoreGroup: FormGroup) => {
            if (scoreGroup.get('courseLessonId').value === item.courseLessonId) {
              scoreGroup.patchValue({
                courseLessonResultId: item.courseLessonResultId,
                point: item.point,
                note: item.note,
                statusId: item.statusId
              });
            }
          });
        });
      }
    });
  }

  initLessons() {
    this.lessonService.findOneById(this.data.courseId, UrlConstant.COURSE_LESSONS.GET_BY_COURSE).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        const listCourseLessonId = [];
        res.data.forEach((item, index) => {
          this.initScores();
          this.scores.at(index).patchValue({
            name: item.name || null,
            courseLessonId: item.courseLessonId || null
          });
          listCourseLessonId.push(item.courseLessonId);
        });
        this.getData(listCourseLessonId);
      }
    });
  }


  initScores = () => {
    const controlsConfig: any = {};
    controlsConfig.courseLessonResultId = [null];
    controlsConfig.name = [null];
    controlsConfig.point = [null, Validators.max(100)];
    controlsConfig.note = [null];
    controlsConfig.statusId = [null];
    controlsConfig.traineeId = [this.data.traineeId];
    controlsConfig.courseLessonId = [null];
    const courses = this.fb.group(controlsConfig);
    this.scores.push(courses);
  };

  getTotalScore() {
    return this.scores.value.reduce((total: number, it: any) => {
      const point = Number(it.point);
      if (!isNaN(point)) {
        return total + point;
      }
      return total;
    }, 0);
  }

  save() {
    this.isSubmitted = true;
    // cleanDataForm(this.form);
    this.body = _.clone(this.form.value);
    this.body['id'] = this.id;
    this.beforeSave();
    if (this.form.invalid || this.invalidFormViewChild) {
      return;
    }
    if (this.mode === Mode.ADD) {
      delete this.body[this.key];
      this.createApi(this.body)
        .subscribe(
          (res: BaseResponse<any>) => {
            if (res.code === HTTP_STATUS_CODE.SUCCESS) {
              this.toast.success(
                this.translate.instant('common.notification.updateSuccess')
              );
              this.afterSave(res);
              if (!this.isPage) {
                this.modalRef?.close({ refresh: true });
              } else {
                this.back();
              }
            }
          }
        );
    }
  }


}

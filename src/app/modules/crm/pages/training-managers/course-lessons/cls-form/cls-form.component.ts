import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {CourseLessonsModel} from "../../../../data-access/models/training-managers/course-lessons.model";
import {CourseLessonsService} from "../../../../data-access/services/training-managers/course-lessons.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";

@Component({
  selector: 'cls-form',
  templateUrl: './cls-form.component.html',
  styleUrls: ['./cls-form.component.scss']
})
export class ClsFormComponent extends BaseFormComponent<CourseLessonsModel> implements OnInit {

  serviceName = MICRO_SERVICE.CRM
  urlLoadData = '/course-lessons'
  constructor(
    private readonly service: CourseLessonsService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'courseLessonId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: CourseLessonsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: CourseLessonsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      courseLessonId: [null],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      courseId: [null, [Validators.required]],
      fileList: [null]

    },
    {validators:
        []
    });
  }
}



import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {CourseTraineesModel} from "../../../../data-access/models/training-managers/course-trainees.model";
import {CourseTraineesService} from "../../../../data-access/services/training-managers/course-trainees.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";

@Component({
  selector: 'cts-form',
  templateUrl: './cts-form.component.html',
  styleUrls: ['./cts-form.component.scss']
})
export class CtsFormComponent extends BaseFormComponent<CourseTraineesModel> implements OnInit {

  serviceName = MICRO_SERVICE.CRM
  urlLoadData = '/course-trainees'
  constructor(
    private readonly service: CourseTraineesService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'courseTraineeId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: CourseTraineesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: CourseTraineesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      courseTraineeId: [null],
      courseId: [null, [Validators.required]],
      traineeId: [null, [Validators.required]],
      instructorId: [null, [Validators.required]],
      fileList: [null]

    },
    {validators:
        []
    });
  }
}



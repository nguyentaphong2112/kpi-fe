import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { CoursesModel } from '../../../../data-access/models/training-managers/courses.model';
import { CoursesService } from '../../../../data-access/services/training-managers/courses.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { DataService } from '@shared/services/data.service';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/crm/data-access/constants/url.class';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { CustomersService } from '@app/modules/crm/data-access/services/order-managers/customers.service';
import { FunctionCode } from '@shared/enums/enums-constant';
import { Scopes } from '@core/utils/common-constants';
import { Observable } from 'rxjs';
import { BaseResponse } from '@core/models/base-response';
import { CustomValidators } from '@core/utils/custom-validations';
import { NzTabSetComponent } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'courses-form',
  templateUrl: './courses-form.component.html',
  styleUrls: ['./courses-form.component.scss']
})
export class CoursesFormComponent extends BaseFormComponent<CoursesModel> implements OnInit {
  @ViewChild(NzTabSetComponent) tabSet: NzTabSetComponent;
  serviceName = MICRO_SERVICE.CRM;
  urlLoadData = UrlConstant.TRAINING_PROGRAM.GET_LIST;
  readonly FORM_ARRAY_NAME = 'listCoursesTrainees';
  readonly FORM_ARRAY_NAME2 = 'courses';
  actionSchema: ActionSchema;
  actionSchema2: ActionSchema;
  isSubmitted2 = false;
  isSubmitted3 = false;
  listCustomer = [];
  listUser = [];
  functionCode = FunctionCode.HR_PERSONAL_INFO;
  scope: string = Scopes.VIEW;
  isImportData = false;
  fileTemplateName = 'templateImport.xlsx';
  listCoursesTrainees = [];
  importApi!: (body: any) => Observable<BaseResponse<any>>;
  downLoadTemplateApi!: (url?: string) => Observable<any>;
  doDownloadFileByNameApi!: (url?: string, fileName?: string) => Observable<any>;

  constructor(
    private readonly service: CoursesService,
    private customerService: CustomersService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'courseId';
    this.initAction();
    this.initDataSelect();
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: CoursesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: CoursesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.downLoadTemplateApi = () => this.service.downloadFile('/trainee/download-template');
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/trainee/import');
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, {fileName: fileName});
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'crm_courses'
    });
    this.getConfigAttributes();
    this.initForm();
  }

  get students(): NzSafeAny {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  get courses(): NzSafeAny {
    return this.form.controls[this.FORM_ARRAY_NAME2] as FormArray;
  }

  doImportData() {
    this.isImportData = true;
  }

  override initForm() {
    this.form = this.fb.group({
        courseId: [null],
        trainingProgramId: [null, [Validators.required]],
        startDate: [null, [Validators.required]],
        endDate: [null, [Validators.required]],
        name: [null, [Validators.required]],
        listAttributes: this.fb.array([]),
        listCoursesTrainees: this.fb.array([]),
        courses: this.fb.array([])
      },
      {
        validators:
          [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError'),
            CustomValidators.formArrayValidator('listCoursesTrainees', ['traineeId', 'instructorId'], 'traineeId')]
      });
    if (this.mode === Mode.ADD) {
      this.initCourses();
      this.initStudents();
    }
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  doCloseImport(isSearch: boolean) {
    this.isImportData = false;
  }


  importData($event) {
    if ($event.code === HTTP_STATUS_CODE.SUCCESS) {
      this.data.listCoursesTrainees.unshift(...$event.data);
    }

  }


  initDataSelect() {
    // this.customerService.getList(null, UrlConstant.CUSTOMER.GET_LIST)
    //   .subscribe(res => {
    //     this.listCustomer = res.data;
    //   });
    // this.service.getList(null, UrlConstant.COURSES.GET_USER_LIST)
    //   .subscribe(res => {
    //     this.listUser = res.data;
    //   });
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
    this.actionSchema2 = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.add',
          icon: 'plus-circle',
          function: this.add2
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          // isShowFn: this.isShowDelete,
          function: this.onDelete2
        })
      ]
    });
  }

  add = () => {
    this.isSubmitted3 = true;
    if (this.students.valid) {
      this.initStudents();
      this.isSubmitted3 = false;
    }
  };

  onDelete = (data: FormGroup) => {
    this.popupService.showModalConfirmDelete(() => {
      if(data['key'] >= this.students.length){
        this.data.listCoursesTrainees.splice(data['key'] - this.students.length,1);
      } else {
        this.students.removeAt(data['key']);
        if (this.students.length === 0 && this.data.listCoursesTrainees.length == 0) {
          this.initStudents();
        }
      }
      
    });
  };

  add2 = () => {
    this.isSubmitted2 = true;
    if (this.courses.valid) {
      this.initCourses();
      this.isSubmitted2 = false;
    }
  };

  onDelete2 = (data: FormGroup) => {
    this.popupService.showModalConfirmDelete(() => {
      this.courses.removeAt(data['key']);
      if (this.courses.length === 0) {
        this.initCourses();
      }
    });
  };

  initCourses = () => {
    const controlsConfig: any = {};
    controlsConfig.courseLessonId = [null];
    controlsConfig.name = [null, Validators.required];
    controlsConfig.courseId = [null];
    const courses = this.fb.group(controlsConfig);
    this.courses.push(courses);
  };

  initStudents = () => {
    const controlsConfig: any = {};
    controlsConfig.courseTraineeId = [null];
    controlsConfig.phoneNumber = [null];
    controlsConfig.traineeId = [null, Validators.required];
    controlsConfig.traineeName = [null],
    controlsConfig.instructorName = [null],
    controlsConfig.instructorId = [null, Validators.required];
    const courses = this.fb.group(controlsConfig);
    this.students.push(courses);
  };

  beforeSave() {
    if (this.students.invalid) {
      this.tabSet.setSelectedIndex(0);
    } else if (this.courses.invalid) {
      this.tabSet.setSelectedIndex(1);
    }
    this.body.lessons = this.courses.value;
    // this.body.oldTraineeIds = [];
    this.data.listCoursesTrainees.forEach((it, index) => {
      this.body.listCoursesTrainees.push(it);
      // this.body.oldTraineeIds.push(it.courseTraineeId);
    });
  }

  afterPatchValue() {
    super.afterPatchValue();
    if (this.data) {
      this.data.lessons.forEach((it, index) => {
        this.initCourses();
        this.courses.controls[index].setValue({
          name: it.name || null,
          courseLessonId: it.courseLessonId || null,
          courseId: it.courseId || null
        });
      });
      // this.data.listCoursesTrainees.forEach((it, index) => {
      //   this.initStudents();
      //   this.students.controls[index].setValue({
      //     phoneNumber: null,
      //     traineeName: it.traineeName,
      //     instructorName: it.instructorName,
      //     traineeId: it.traineeId || null,
      //     instructorId: it.instructorId || null,
      //     courseTraineeId: it.courseTraineeId || null
      //   });
      // });
    }
  }

  getPhoneNumber($event, index: number) {
    if ($event?.itemSelected) {
      this.students.at(index).get('phoneNumber').setValue($event?.itemSelected.mobileNumber);
    } else {
      if (!$event?.listOfSelected) {
        this.students.at(index).get('phoneNumber').setValue(null);
      }
    }
  }
}



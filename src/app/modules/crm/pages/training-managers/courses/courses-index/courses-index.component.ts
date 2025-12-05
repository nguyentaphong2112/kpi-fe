import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CoursesModel } from '../../../../data-access/models/training-managers/courses.model';
import { CoursesService } from '../../../../data-access/services/training-managers/courses.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Constant } from '@app/modules/crm/data-access/constants/constants';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import {
  CoursesFormComponent
} from '@app/modules/crm/pages/training-managers/courses/courses-form/courses-form.component';
import { REQUEST_TYPE } from '@shared/constant/common';
import {
  ScoresFormComponent
} from '@app/modules/crm/pages/training-managers/courses/scores-form/scores-form.component';
import { UrlConstant } from '@app/modules/crm/data-access/constants/url.class';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CourseTraineesService } from '@app/modules/crm/data-access/services/training-managers/course-trainees.service';
import { Validators } from '@angular/forms';
import { CourseLessonsService } from '@app/modules/crm/data-access/services/training-managers/course-lessons.service';

@Component({
  selector: 'app-courses-index',
  templateUrl: './courses-index.component.html',
  styleUrls: ['./courses-index.component.scss']
})


export class CoursesIndexComponent extends BaseListComponent<CoursesModel> implements OnInit {
  isShowAdvSearch = false;
  functionCode = Constant.FUNCTION_CODE.CRM_COURSES;
  listCourse: any[] = [];
  serviceName = MICRO_SERVICE.CRM;
  urlLoadData = UrlConstant.TRAINING_PROGRAM.GET_LIST;
  listCourse2: any[] = [];
  listLesson: any[] = [];
  urlLoadCustomer = UrlConstant.CUSTOMER.GET_LIST_SEARCH;
  urlLoadUser = UrlConstant.COURSES.GET_USER_LIST_SEARCH;
  nzWidth: number;

  @ViewChild('footerTmpl2', { static: true }) footerTpl2!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: CoursesService,
    private readonly lessonService: CourseLessonsService,
    private courseTraineeService: CourseTraineesService
  ) {
    super(injector);
    this.initFormSearch();
    this.initDataSelect();
    this.deleteApi = (id: number | string) => this.courseTraineeService.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template', this.formImport.value);
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import');
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, { fileName: fileName });
    this.key = 'courseId';
    this.formConfig = {
      title: 'crm.courses.label.title',
      content: CoursesFormComponent
    };
    this.nzWidth = window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5;
  }

  get f() {
    return this.formImport.controls;
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
  }


  initFormSearch() {
    this.form = this.fb.group({
      courseId: [null],
      keySearch: [null],
      phoneNumber: [null],
      traineeId: [null],
      date: [null],
      instructorId: [null]
    });
    this.initFormImport();
  }

  initFormImport() {
    this.formImport = this.fb.group({
      courseId: [null, [Validators.required]],
      trainingProgramId: [null, [Validators.required]],
      courseLessonId: [null, [Validators.required]]
    });
  }

  afterCloseImport() {
    this.formImport.reset();
  }

  trainingChange($event) {
    if ($event) {
      this.service.getList({ trainingProgramId: $event }, UrlConstant.COURSES.GET_COURSE_LIST).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listCourse2 = res.data;
          this.f.courseId.setValue(null);
          this.f.courseLessonId.setValue(null);
        }
      });
    } else {
      this.listCourse2 = [];
      this.listLesson = [];
      this.f.courseId.setValue(null);
      this.f.courseLessonId.setValue(null);
    }
  }

  courseChange($event) {
    if ($event) {
      this.lessonService.findOneById($event, UrlConstant.COURSE_LESSONS.GET_BY_COURSE_LIST).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listLesson = res.data;
          this.f.courseLessonId.setValue(null);
        }
      });
    } else {
      this.listLesson = [];
      this.f.courseLessonId.setValue(null);
    }
  }

  initDataSelect() {
    this.service.getList(null, UrlConstant.COURSES.GET_COURSE_LIST).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listCourse = res.data;
      }
    });
  }

  afterRefresh() {
    this.initDataSelect();
  }


  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: this.objFunction?.edit,
          function: (evt: any) => {
            this.openModal('EDIT', evt);
          }
        }),
        new ChildActionSchema({
          label: 'crm.courses.label.scored',
          icon: 'file-done',
          isShow: this.objFunction?.edit,
          function: (evt: any) => {
            this.openModal('SCORE', evt);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          function: this.deleteData
        })
      ]
    });
  }

  openModal(type: 'ADD' | 'EDIT' | 'SCORE', data?: any) {
    if (type === 'EDIT' || type === 'ADD') {
      this.formConfig = {
        title: 'crm.courses.label.title',
        content: CoursesFormComponent
      };
      if (type === 'EDIT') {
        this.doOpenForm(this.modeConst.EDIT, data);
      } else {
        this.doOpenForm(this.modeConst.ADD);
      }
    } else {
      this.formConfig = {
        title: 'crm.courses.label.scored',
        content: ScoresFormComponent
      };
      this.doOpenForm(null, data);
    }
  }

  deleteData = (data: any) => {
    if (this.isShowPopupConfirm) {
      this.popupService.showModalConfirmDelete(() => {
        this.processDeleteData(data['courseTraineeId']);
      });
    } else {
      this.processDeleteData(data['courseTraineeId']);
    }
  };

  override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 70
      },

      {
        title: 'crm.courses.table.phoneNumber',
        field: 'mobileNumber',
        thClassList: ['text-center'],
        width: 100
      },
      {
        title: 'crm.courses.table.name',
        field: 'name',
        thClassList: ['text-center'],
        width: 250
      },
      {
        title: 'crm.courses.table.dateOfBirth',
        field: 'dateOfBirth',
        thClassList: ['text-center'],
        width: 100
      },
      {
        title: 'crm.courses.table.courseName',
        field: 'courseName',
        thClassList: ['text-center'],
        width: 200
      },
      {
        title: 'crm.courses.table.studyTime',
        field: 'dateRange',
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'crm.courses.table.totalScore',
        field: 'totalPoint',
        thClassList: ['text-center'],
        width: 50
      },
      {
        title: 'crm.courses.table.completionRate',
        field: 'completionRate',
        thClassList: ['text-center'],
        width: 50
      },
      {
        title: 'crm.courses.table.rating',
        field: 'rank',
        thClassList: ['text-center'],
        width: 50
      },
      {
        title: 'crm.courses.table.tutor',
        field: 'instructorName',
        thClassList: ['text-center']
      },
      {
        title: 'crm.courses.table.phoneNumberTutor',
        field: 'phoneNumberInstructor',
        thClassList: ['text-center'],
        show: false
      },
      {
        title: 'crm.courses.table.createdBy',
        field: 'createdBy',
        width: 120,
        show: false
      },
      {
        title: 'crm.courses.table.createdTime',
        field: 'createdTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.courses.table.modifiedBy',
        field: 'modifiedBy',
        width: 120,
        show: false
      },
      {
        title: 'crm.courses.table.modifiedTime',
        field: 'modifiedTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: '',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
        width: 50,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: window.innerWidth > 1024,
        fixedDir: 'right',
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit
      }
    ];
  };
}


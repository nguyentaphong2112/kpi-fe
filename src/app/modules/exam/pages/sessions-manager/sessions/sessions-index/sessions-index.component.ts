import { Component, Injector, OnInit } from '@angular/core';
import { SessionsModel } from '../../../../data-access/models/sessions-manager/sessions.model';
import { SessionsService } from '../../../../data-access/services/sessions-manager/sessions.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { FunctionCode } from '@shared/enums/enums-constant';
import { distinctUntilChanged } from 'rxjs';
import { ExamPapersService } from '@app/modules/exam/data-access/services/exam-papers-manager/exam-papers.service';

@Component({
  selector: 'app-sessions-index',
  templateUrl: './sessions-index.component.html',
  styleUrls: ['./sessions-index.component.scss']
})


export class SessionsIndexComponent extends BaseListComponent<SessionsModel> implements OnInit {
  serviceName = MICRO_SERVICE.EXAM;
  functionCode = FunctionCode.EXAM_SESSIONS;
  listExamPaper = [];

  constructor(
    injector: Injector,
    private readonly service: SessionsService,
    private examPapersService: ExamPapersService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import');
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, { fileName: fileName });
    this.key = 'sessionId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initAction();
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: this.objFunction?.edit,
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          function: this.deleteItem
        })
      ]
    });
  }

  get f() {
    return this.form.controls;
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: null,
      subjectCode: [null],
      topicCode: [null],
      statusCode: [null],
      examPaperIds: [null]
    });

    this.subscriptions.push(
      this.f.subjectCode.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
        this.getListPaper();
      })
    );
    this.subscriptions.push(
      this.f.topicCode.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
        this.getListPaper();
      })
    );
  }

  getListPaper() {
    if (!this.f['subjectCode'].value && !this.f['topicCode'].value) {
      this.f['examPaperIds'].setValue([]);
      this.listExamPaper = [];
      return;
    }
    const params = {
      subjectCode: this.f['subjectCode'].value,
      topicCode: this.f['topicCode'].value
    };
    this.examPapersService.getList(params, '/list', true).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listExamPaper = res.data;
        const currentValues = this.f['examPaperIds'].value || [];
        const validIds = this.listExamPaper.map(it => it.examPaperId);
        const filteredValues = currentValues.filter(id => validIds.includes(id));
        this.f['examPaperIds'].setValue(filteredValues.length ? filteredValues : []);
      }
    });
  }


  override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 50
      },
      {
        title: 'exam.sessions.form.code',
        field: 'code',
        thClassList: ['text-center'],
        width: 80
      },
      {
        title: 'exam.sessions.form.name',
        thClassList: ['text-center'],
        field: 'name',
        width: 150
      },
      {
        title: 'exam.sessions.form.examPaper',
        thClassList: ['text-center'],
        field: 'examCodes',
        width: 150
      },
      {
        title: 'exam.sessions.form.subjectCode',
        thClassList: ['text-center'],
        field: 'subjectName',
        width: 100
      },
      {
        title: 'exam.sessions.form.topicCode',
        thClassList: ['text-center'],
        field: 'topicName',
        width: 100
      },
      {
        title: 'exam.sessions.form.statusCode',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        field: 'statusName',
        width: 100
      },
      {
        title: 'exam.sessions.label.countPar',
        thClassList: ['text-center'],
        field: 'countPar',
        width: 100
      },
      {
        title: 'exam.sessions.form.startTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        field: 'startTime',
        width: 100
      },
      {
        title: 'exam.sessions.form.durationMinutes',
        thClassList: ['text-center'],
        tdClassList: ['text-right'],
        field: 'durationMinutes',
        width: 80
      },
      {
        title: 'common.label.createdBy',
        thClassList: ['text-center'],
        field: 'createdBy',
        width: 150,
        show: false
      },
      {
        title: 'common.label.createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        field: 'createdTime',
        width: 150,
        show: false
      },
      {
        title: 'common.label.modifiedBy',
        thClassList: ['text-center'],
        field: 'modifiedBy',
        width: 150,
        show: false
      },
      {
        title: 'common.label.modifiedTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        field: 'modifiedTime',
        width: 150,
        show: false
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 40,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
  }
}


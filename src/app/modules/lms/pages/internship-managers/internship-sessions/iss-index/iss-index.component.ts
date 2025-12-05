import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { InternshipSessionsModel } from '../../../../data-access/models/internship-managers/internship-sessions.model';
import { InternshipSessionsService } from '../../../../data-access/services/internship-managers/internship-sessions.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { UrlConstant as UrlConstantShare } from '@shared/constant/url.class';
import { IssFormComponent } from '../iss-form/iss-form.component';
import { Constant } from '@app/modules/lms/data-access/constants/constants';
import { ActionSchema, ChildActionSchema } from '@app/core/models/action.model';

@Component({
  selector: 'app-iss-index',
  templateUrl: './iss-index.component.html',
  styleUrls: ['./iss-index.component.scss'],
})
export class IssIndexComponent extends BaseListComponent<InternshipSessionsModel> implements OnInit {
  urlLoadData = '/internship-sessions';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  isShowAdvSearch = false;

  constructor(injector: Injector, private readonly service: InternshipSessionsService) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) =>
      this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import');
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.doDownloadFileByNameApi = (url: string) => this.service.downloadFile(url);
    this.serviceName = MICRO_SERVICE.LMS;
    this.functionCode = Constant.FUNCTION_CODE.INTERNSHIP_SESSION;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'internshipSessionId';
    this.formConfig = {
      title: 'lms.internshipSessions.pageName',
      content: IssFormComponent,
    };
  }

  ngOnInit(): void {
      super.ngOnInit()
      this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
      this.initAction()
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch:null,
      universityId:null,
      sessionName:null,
      startDate:null,
      endDate:null
    });
  }

  initAction(){
    this.actionSchema = new ActionSchema({
      arrAction:[
        new ChildActionSchema({
          label:'common.button.detail',
          icon:'eye',
          isShow: this.objFunction?.edit,
          function:this.doOpenFormDetail
        }),
        new ChildActionSchema({
          label:'common.button.edit',
          icon:'edit',
          isShow: this.objFunction?.edit,
          function:this.doOpenFormEdit
        }),

        new ChildActionSchema({
          label:'common.button.delete',
          icon:'delete',
          isShow: this.objFunction?.delete,
          function:this.deleteItem
        }),
      ]
    })
  }

  override beforeSearch() {}

  override beforeRenderTable() {
    this.responseSearch.data.listData.forEach((el) => {
      // el.list = this.list;
    });
  }

  override beforeExport() {}

  override setHeaders() {
    this.tableConfig.key = this.key;
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 70,
      },
      {
        title: 'lms.internshipSessions.table.universityId',
        field: 'universityName',
        width: 200,
      },
      {
        title: 'lms.internshipSessions.table.sessionName',
        field: 'sessionName',
        width: 200,
      },
      {
        title: 'lms.internshipSessions.table.startDate',
        field: 'startDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
      },
      {
        title: 'lms.internshipSessions.table.endDate',
        field: 'endDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
      },
      {
        title: 'lms.internshipSessions.table.totalStudents',
        field: 'totalStudents',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
      },
      {
        title: 'lms.internshipSessions.table.createdBy',
        field: 'createdBy',
        width: 120,
        show: false,
      },
      {
        title: 'lms.internshipSessions.table.createdTime',
        field: 'createdTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
      },
      {
        title: 'lms.internshipSessions.table.modifiedBy',
        field: 'modifiedBy',
        width: 120,
        show: false,
      },
      {
        title: 'lms.internshipSessions.table.modifiedTime',
        field: 'modifiedTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
      },
      {
        title: 'lms.internshipSessions.table.lastUpdateTime',
        field: 'lastUpdateTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
      },
      {
        title: ' ',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 50,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: window.innerWidth > 1024,
        fixedDir: 'right',
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit || true,
      },
    ];
  }
}

import { Component, Injector, OnInit } from '@angular/core';
import { MentoringTraineesModel } from '../../../../data-access/models/mentorings/mentoring-trainees.model';
import { MentoringTraineesService } from '../../../../data-access/services/mentorings/mentoring-trainees.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { MtsFormComponent } from '@app/modules/lms/pages/mentorings/mentoring-trainees/mts-form/mts-form.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { Scopes } from '@core/utils/common-constants';
import { Utils } from '@core/utils/utils';
import { FunctionCode } from '@shared/enums/enums-constant';
import { Constant } from '@app/modules/lms/data-access/constants/constants';
import { REQUEST_TYPE } from '@shared/constant/common';

@Component({
  selector: 'app-mts-index',
  templateUrl: './mts-index.component.html',
  styleUrls: ['./mts-index.component.scss']
})


export class MtsIndexComponent extends BaseListComponent<MentoringTraineesModel> implements OnInit {
  microService = MICRO_SERVICE;
  serviceName = MICRO_SERVICE.LMS;
  isShowAdvSearch = false;
  functionCode = Constant.FUNCTION_CODE.MENTORING_TRAINEES;
  scope: string = Scopes.VIEW;
  functionCodeEmployee = FunctionCode.HR_PERSONAL_INFO;

  constructor(
    injector: Injector,
    private readonly service: MentoringTraineesService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination);
    this.exportApi = (body) => this.service.export(body);
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import');
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, {fileName: fileName});
    this.serviceName = MICRO_SERVICE.LMS;
    this.key = 'medMentoringTraineeId';
    this.formConfig = {
      title: 'med.mentoringTrainees.pageName',
      content: MtsFormComponent
    };
  }

  ngOnInit() {
    super.ngOnInit();
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


  initFormSearch() {
    this.form = this.fb.group({
      keySearch: null,
      organizationId: null,
      employeeId: null,
      startDate: null,
      endDate: null
    });
  }

  beforeSearch() {
    this.params.startDate = Utils.convertDateToSendServer(this.params.startDate);
    this.params.endDate = Utils.convertDateToSendServer(this.params.endDate);
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
        title: 'med.mentoringTrainees.table.employeeCode',
        field: 'employeeCode',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'med.mentoringTrainees.table.employeeName',
        field: 'employeeName',
        width: 120
      },
      {
        title: 'med.mentoringTrainees.table.startDate',
        field: 'startDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'med.mentoringTrainees.table.endDate',
        field: 'endDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'med.mentoringTrainees.table.documentNo',
        field: 'documentNo',
        width: 120
      },
      {
        title: 'med.mentoringTrainees.table.projectName',
        field: 'projectName',
        width: 120
      },
      {
        title: 'med.mentoringTrainees.table.hospitalName',
        field: 'hospitalName',
        width: 120
      },
      {
        title: 'med.mentoringTrainees.table.totalLessons',
        field: 'totalLessons',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'med.mentoringTrainees.table.content',
        field: 'content',
        width: 120
      },
      {
        title: 'med.mentoringTrainees.table.createdBy',
        field: 'createdBy',
        width: 120,
        show: false
      },
      {
        title: 'med.mentoringTrainees.table.createdTime',
        field: 'createdTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'med.mentoringTrainees.table.modifiedBy',
        field: 'modifiedBy',
        width: 120,
        show: false
      },
      {
        title: 'med.mentoringTrainees.table.modifiedTime',
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


import { Component, Injector, OnInit } from '@angular/core';
import { TrainingProcessModel } from '../../../../data-access/models/training-managers/training-process.model';
import { TrainingProcessService } from '../../../../data-access/services/training-managers/training-process.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Scopes } from '@core/utils/common-constants';
import { FunctionCode } from '@shared/enums/enums-constant';
import { Constant } from '@app/modules/lms/data-access/constants/constants';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import {
  TpsFormComponent
} from '@app/modules/lms/pages/training-managers/training-process/tps-form/tps-form.component';
import { REQUEST_TYPE } from '@shared/constant/common';

@Component({
  selector: 'app-tps-index',
  templateUrl: './tps-index.component.html',
  styleUrls: ['./tps-index.component.scss']
})


export class TpsIndexComponent extends BaseListComponent<TrainingProcessModel> implements OnInit {
  isShowAdvSearch = false;
  scope: string = Scopes.VIEW;
  functionCode = Constant.FUNCTION_CODE.TRAINING_PROCESS;
  functionCodeEmployee = FunctionCode.HR_PERSONAL_INFO;

  constructor(
    injector: Injector,
    private readonly service: TrainingProcessService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(body);
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import');
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, {fileName: fileName});
    this.key = 'trainingProcessId';
    this.formConfig = {
      title: 'lms.trainingProcess.pageName',
      content: TpsFormComponent
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: null,
      employeeId: null,
      startDate: null,
      endDate: null
    });
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
        title: 'lms.trainingProcess.table.employeeCode',
        field: 'employeeCode',
        width: 100,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'lms.trainingProcess.table.employeeName',
        field: 'employeeName',
        width: 200,
        thClassList: ['text-center']
      },
      {
        title: 'lms.trainingProcess.table.jobName',
        field: 'jobName',
        width: 200,
        thClassList: ['text-center']
      },
      {
        title: 'lms.trainingProcess.table.orgName',
        field: 'orgName',
        width: 200
      },
      {
        title: 'lms.trainingProcess.table.startDate',
        field: 'startDate',
        width: 110,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'lms.trainingProcess.table.endDate',
        field: 'endDate',
        width: 110,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'lms.trainingProcess.table.majorName',
        field: 'majorName',
        width: 200
      },
      {
        title: 'lms.trainingProcess.table.trainingPlaceName',
        field: 'trainingPlaceName',
        width: 200
      },
      {
        title: 'lms.trainingProcess.table.trainingPlanName',
        field: 'trainingPlanName',
        width: 200
      },
      {
        title: 'lms.trainingProcess.table.trainingCourseName',
        field: 'trainingCourseName',
        width: 200
      },
      {
        title: 'lms.trainingProcess.table.documentNo',
        field: 'documentNo',
        width: 200
      },
      {
        title: 'lms.trainingProcess.table.documentSignedDate',
        field: 'documentSignedDate',
        width: 110,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'lms.trainingProcess.table.totalHours',
        field: 'totalHours',
        width: 50,
        tdClassList: ['text-right'],
        thClassList: ['text-center']
      },
      {
        title: 'lms.trainingProcess.table.totalBudget',
        field: 'totalBudget',
        width: 100,
        tdClassList: ['text-right'],
        thClassList: ['text-center']
      },      
      {
        title: 'lms.trainingProcess.table.createdBy',
        field: 'createdBy',
        width: 120,
        show: false
      },
      {
        title: 'lms.trainingProcess.table.createdTime',
        field: 'createdTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'lms.trainingProcess.table.modifiedBy',
        field: 'modifiedBy',
        width: 120,
        show: false
      },
      {
        title: 'lms.trainingProcess.table.modifiedTime',
        field: 'modifiedTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: ' ',
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
  }
}


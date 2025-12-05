import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { AppFunction } from '@core/models/app-function.interface';
import { FunctionCode } from '@shared/enums/enums-constant';
import { BaseResponse } from '@app/core/models/base-response';
import { EmployeesInfo, InfoDetailBean } from '@app/modules/hrm/data-access/models/employee-info';
import { BaseListComponent } from '@core/components/base-list.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { HBTTableConfig } from '@shared/component/hbt-table/hbt-table.interfaces';
import { TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { AwardProcessService } from '@app/modules/hrm/data-access/services/staff-info/award-process.service';
import { ApsFormComponent } from '@app/modules/hrm/pages/staff-research/award-process/aps-form/aps-form.component';
import { DpsFormComponent } from '@app/modules/hrm/pages/staff-research/discipline-process/dps-form/dps-form.component';
import {
  EvaluationResultsService
} from '@app/modules/hrm/data-access/services/staff-research/evaluation-results.service';
import { ErsFormComponent } from '@app/modules/hrm/pages/staff-research/evaluation-results/ers-form/ers-form.component';
import {
  DisciplineProcessService
} from '@app/modules/hrm/data-access/services/staff-research/discipline-process.service';
import { AlertModalChangeService } from '@app/modules/hrm/data-access/services/staff-info/alert-modal-change.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './award-information.component.html',
  styleUrls: ['./award-information.component.scss']
})
export class AwardInformationComponent extends BaseListComponent<NzSafeAny> implements OnInit, OnDestroy {
  objFunctionAwardProcess: AppFunction;
  objFunctionDisciplineProcess: AppFunction;
  objFunctionEvaluationResult: AppFunction;
  items: EmployeesInfo | NzSafeAny;
  subs: Subscription[] = [];
  response: BaseResponse<any> = new BaseResponse();
  awardInfo: InfoDetailBean[] = [];
  isDetail = false;
  tableDataDiscipline: NzSafeAny[] = [];
  tableDataEvaluationResult: NzSafeAny[] = [];
  employeeId: any;

  moduleName = Constant.MODULE_NAME.DISCIPLINE;
  functionCode: string = FunctionCode.HR_DISCIPLINE_PROCESS;
  urlConstant = UrlConstant;
  fileExportName = 'thong_tin_ky_luat.xlsx';

  tableConfigDisciplineProcess: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };

  tableConfigEvaluationResult: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };

  @Input() data: any;

  constructor(
    injector: Injector,
    private awardProcessService: AwardProcessService,
    private disciplineProcessService: DisciplineProcessService,
    private alertModalChangeService: AlertModalChangeService,
    private evaluationResultService: EvaluationResultsService
  ) {
    super(injector);
    this.isCustomSearch = true;
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunctionAwardProcess = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.PERSONAL_AWARD_PROCESS}`);
    this.objFunctionDisciplineProcess = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.PERSONAL_DISCIPLINE_PROCESS}`);
    this.objFunctionEvaluationResult = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.PERSONAL_EVALUATION_RESULTS}`);
    this.initAction();
    this.employeeId = 1;
  }

  search(page?: number, type = '', isAlertModal = true) {
    if (isAlertModal) {
      this.alertModalChangeService.closePersonalInfo();
    }
    this.pagination.pageNumber = page ?? 1;
    if ((type === 'award' || type === '') && this.objFunctionAwardProcess?.view) {
      this.awardProcessService.getAwardProcess(null, this.pagination.getCurrentPage()).subscribe(res => {
        this.tableData = res.data.listData.map(el => {
          return { ...el, tableType: 'award' };
        });
        this.tableConfig.total = res.data.total;
        this.tableConfig.pageIndex = res.data.pageIndex;
      });
    }
    if ((type === 'discipline' || type === '') && this.objFunctionDisciplineProcess?.view) {
      this.disciplineProcessService.getDisciplineProcess(null, this.pagination.getCurrentPage()).subscribe((res => {
        this.tableDataDiscipline = res.data.listData.map(el => {
          return { ...el, tableType: 'discipline' };
        });
        this.tableConfigDisciplineProcess.total = res.data.total;
        this.tableConfigDisciplineProcess.pageIndex = res.data.pageIndex;
      }));
    }
    if ((type === 'evaluation' || type === '') && this.objFunctionEvaluationResult?.view) {
      this.evaluationResultService.getEvaluationResult(null, this.pagination.getCurrentPage()).subscribe(res => {
        this.tableDataEvaluationResult = res.data.listData.map(el => {
          return { ...el, tableType: 'evaluation' };
        });
        this.tableConfigEvaluationResult.total = res.data.total;
        this.tableConfigEvaluationResult.pageIndex = res.data.pageIndex;
      });
    }
  }

  doOpenFormCustom(type: string) {
    const formConfigMap: { [key: string]: any } = {
      award: {
        title: 'hrm.staffManager.staffResearch.pageName.awardProcessInfo',
        content: ApsFormComponent,
        config: UrlConstant.EMPLOYEES.PERSONAL
      },
      discipline: {
        title: 'hrm.staffManager.staffResearch.pageName.disciplineProcessInfo',
        content: DpsFormComponent,
        config: UrlConstant.EMPLOYEES.PERSONAL
      },
      evaluation: {
        title: 'hrm.staffManager.staffResearch.pageName.evaluationResultInfo',
        content: ErsFormComponent,
        config: UrlConstant.EMPLOYEES.PERSONAL
      }
    };

    this.formConfig = formConfigMap[type];
    this.doOpenForm(this.modeConst.ADD, { hiddenEmp: true, employeeId: this.employeeId });
  }

  deleteItemCustom = (data: any) => {
    if (data.tableType === 'award') {
      this.key = 'awardProcessId';
      this.deleteApi = (id: number | string) => this.awardProcessService.deleteById(id.toString(), UrlConstant.EMPLOYEES.PERSONAL);
    }
    if (data.tableType === 'discipline') {
      this.key = 'disciplineProcessId';
      this.deleteApi = (id: number | string) => this.disciplineProcessService.deleteById(id.toString(), UrlConstant.EMPLOYEES.PERSONAL);
    }
    if (data.tableType === 'evaluation') {
      this.key = 'evaluationResultId';
      this.deleteApi = (id: number | string) => this.evaluationResultService.deleteById(id.toString(), UrlConstant.EMPLOYEES.PERSONAL);
    }
    this.deleteItem(data);
  };

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  showPersonalInfo() {
    this.awardInfo = this.data?.awardInfo;
    return this.awardInfo;
  }

  doOpenFormEditCustom = (data: any) => {
    if (data.tableType === 'award') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.awardProcessInfo',
        content: ApsFormComponent, config: UrlConstant.EMPLOYEES.PERSONAL
      };
    }
    if (data.tableType === 'discipline') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.disciplineProcessInfo',
        content: DpsFormComponent, config: UrlConstant.EMPLOYEES.PERSONAL
      };
    }
    if (data.tableType === 'evaluation') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.evaluationResultInfo',
        content: ErsFormComponent, config: UrlConstant.EMPLOYEES.PERSONAL
      };
    }
    this.doOpenFormEdit({ ...data, hiddenEmp: true });
  };


  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShowFn: this.isShowEdit,
          function: this.doOpenFormEditCustom
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShowFn: this.isShowDelete,
          function: this.deleteItemCustom
        })
      ]
    });
  }

  isShowEdit = (data: any): boolean => {
    if (data.tableType === 'award') {
      return this.objFunctionAwardProcess?.edit;
    }
    if (data.tableType === 'discipline') {
      return this.objFunctionDisciplineProcess?.edit;
    }
    if (data.tableType === 'evaluation') {
      return this.objFunctionEvaluationResult?.edit;
    }
    return true;
  };

  isShowDelete = (data: any): boolean => {
    if (data.tableType === 'award') {
      return this.objFunctionAwardProcess?.delete;
    }
    if (data.tableType === 'discipline') {
      return this.objFunctionDisciplineProcess?.delete;
    }
    if (data.tableType === 'evaluation') {
      return this.objFunctionEvaluationResult?.delete;
    }
    return true;
  };

  viewDetail() {
    this.isDetail = !this.isDetail;
    if (this.isDetail) {
      this.search(1, '', false);
    }
  }

  override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixedDir: 'left',
        width: 50,
        fixed: window.innerWidth > 1024
      },
      {
        title: 'hrm.staffManager.staffResearch.rewardRecord.table.year',
        field: 'awardYear',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'hrm.staffManager.staffResearch.rewardRecord.table.rewardTitle',
        field: 'awardFormName'
      },
      {
        title: 'hrm.staffManager.staffResearch.rewardRecord.table.documentNumber',
        field: 'documentNo'
      },
      {
        title: 'hrm.staffManager.staffResearch.rewardRecord.table.decideDate',
        field: 'documentSignedDate',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'common.label.createdBy',
        field: 'createdBy',
        width: 150,
        show: false
      },
      {
        title: 'common.label.createdTime',
        tdClassList: ['text-center'],
        field: 'createdTime',
        width: 120,
        show: false
      },
      {
        title: 'common.label.modifiedBy',
        field: 'modifiedBy',
        width: 150,
        show: false
      },
      {
        title: 'common.label.modifiedTime',
        tdClassList: ['text-center'],
        field: 'modifiedTime',
        width: 120,
        show: false
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 60,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];

    this.tableConfigDisciplineProcess.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixedDir: 'left',
        width: 50,
        fixed: window.innerWidth > 1024
      },
      {
        title: 'hrm.staffManager.staffResearch.discipline.table.signedDate',
        field: 'documentSignedDate',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'hrm.staffManager.staffResearch.discipline.table.disciplineMethodName',
        field: 'disciplineFormName'
      },
      {
        title: 'hrm.staffManager.staffResearch.discipline.table.reason',
        field: 'reason'
      },
      {
        title: 'hrm.staffManager.staffResearch.discipline.table.disciplineLevelName',
        field: 'signedDepartment'
      },
      {
        title: 'hrm.staffManager.staffResearch.discipline.table.effectiveDate',
        field: 'startDate',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'hrm.staffManager.staffResearch.discipline.table.expirationDate',
        field: 'endDate',
        width: 150,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'common.label.createdBy',
        field: 'createdBy',
        width: 150,
        show: false
      },
      {
        title: 'common.label.createdTime',
        tdClassList: ['text-center'],
        field: 'createdTime',
        width: 120,
        show: false
      },
      {
        title: 'common.label.modifiedBy',
        field: 'modifiedBy',
        width: 150,
        show: false
      },
      {
        title: 'common.label.modifiedTime',
        tdClassList: ['text-center'],
        field: 'modifiedTime',
        width: 120,
        show: false
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 60,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
    this.tableConfigEvaluationResult.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixedDir: 'left',
        width: 50,
        fixed: window.innerWidth > 1024
      },
      {
        title: 'hrm.staffManager.evaluationResults.table.year',
        field: 'year',
        width: 150,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'hrm.staffManager.evaluationResults.table.evaluationPeriodId',
        field: 'evaluationPeriodName'
      },
      {
        title: 'hrm.staffManager.evaluationResults.table.evaluationType',
        field: 'evaluationTypeName'
      },
      {
        title: 'hrm.staffManager.evaluationResults.table.kpiResult',
        field: 'kpiResult'
      },
      {
        title: 'hrm.staffManager.evaluationResults.table.kpiPoint',
        field: 'kpiPoint'
      },
      {
        title: 'hrm.staffManager.evaluationResults.table.note',
        field: 'note'
      },
      {
        title: 'common.label.createdBy',
        field: 'createdBy',
        width: 150,
        show: false
      },
      {
        title: 'common.label.createdTime',
        tdClassList: ['text-center'],
        field: 'createdTime',
        width: 120,
        show: false
      },
      {
        title: 'common.label.modifiedBy',
        field: 'modifiedBy',
        width: 150,
        show: false
      },
      {
        title: 'common.label.modifiedTime',
        tdClassList: ['text-center'],
        field: 'modifiedTime',
        width: 120,
        show: false
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 60,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
  }

}

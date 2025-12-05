import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { AppFunction } from '@core/models/app-function.interface';
import { FunctionCode } from '@shared/enums/enums-constant';
import { BaseResponse } from '@core/models/base-response';
import { EmployeesInfo, InfoDetailBean } from '@app/modules/hrm/data-access/models/employee-info';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { BaseListComponent } from '@core/components/base-list.component';
import { HBTTableConfig } from '@shared/component/hbt-table/hbt-table.interfaces';
import { TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { WorkInfoService } from '@app/modules/hrm/data-access/services/staff-info/work-info.service';
import { WpsFormComponent } from '@app/modules/hrm/pages/staff-research/work-process/wps-form/wps-form.component';
import {
  ConcurrentProcessInfoService
} from '@app/modules/hrm/data-access/services/staff-info/concurrent-process-info.service';
import {
  CpsFormComponent as ConcurrentProcessFormComponent
} from '@app/modules/hrm/pages/staff-research/concurrent-process/cps-form/cps-form.component';
import {
  CpsFormComponent as ContractProcessFormComponent
} from '@app/modules/hrm/pages/staff-research/contract-process/cps-form/cps-form.component';
import { ContactInfoService } from '@app/modules/hrm/data-access/services/staff-info/contact-info.service';
import { InsuranceSalaryService } from '@app/modules/hrm/data-access/services/staff-info/insurance-salary.service';
import {
  IpsFormComponent
} from '@app/modules/hrm/pages/staff-research/insurance-salary-process/ips-form/ips-form.component';
import {
  PositionSalaryProcessService
} from '@app/modules/hrm/data-access/services/staff-info/position-salary-process.service';
import {
  PspFormComponent
} from '@app/modules/hrm/pages/staff-research/position-salary-process/psp-form/psp-form.component';
import {
  AllowanceProcessService
} from '@app/modules/hrm/data-access/services/staff-research/allowance-process.service';
import { ApsFormComponent } from '@app/modules/hrm/pages/staff-research/allowance-process/aps-form/aps-form.component';
import { AlertModalChangeService } from '@app/modules/hrm/data-access/services/staff-info/alert-modal-change.service';
import { ShareDataService } from '@shared/services/share-data.service';
import {
  PlanningAssignmentsService
} from '@app/modules/hrm/data-access/services/staff-research/planning-assignments.service';
import {
  PasFormComponent
} from '@app/modules/hrm/pages/staff-research/planning-assignments/pas-form/pas-form.component';

@Component({
  selector: 'app-personal-information',
  templateUrl: './win.component.html',
  styleUrls: ['./win.component.scss']
})
export class WinComponent extends BaseListComponent<NzSafeAny> implements OnInit, OnDestroy {
  objFunctionWorkProcess: AppFunction;
  objFunctionConcurrentProcess: AppFunction;
  objFunctionContactProcess: AppFunction;
  objFunctionSalaryProgress: AppFunction;
  objFunctionPositionSalary: AppFunction;
  objFunctionAllowanceProcess: AppFunction;
  objFunctionPlanningAssignment: AppFunction;
  items: EmployeesInfo | NzSafeAny;
  subs: Subscription[] = [];
  response: BaseResponse<any> = new BaseResponse();
  workInfos: InfoDetailBean[] = [];
  tableDataConcurrentProcess: NzSafeAny[] = [];
  tableDataWorkProcess: NzSafeAny[] = [];
  tableDataContractProcess: NzSafeAny[] = [];
  tableDataInsuranceSalary: NzSafeAny[] = [];
  tableDataPositionSalary: NzSafeAny[] = [];
  tableDataAllowanceProcess: NzSafeAny[] = [];
  tableDataPlanningAssignment: NzSafeAny[] = [];
  isDetail = false;
  employeeId: any;

  @Input() data: any;

  constructor(
    injector: Injector,
    private workInfoService: WorkInfoService,
    private concurrentProcessInfoService: ConcurrentProcessInfoService,
    private contactInfoService: ContactInfoService,
    private salaryProcessService: InsuranceSalaryService,
    private positionSalaryProcessService: PositionSalaryProcessService,
    private alertModalChangeService: AlertModalChangeService,
    private shareService: ShareDataService,
    private allowanceProcessService: AllowanceProcessService,
    private planningAssignmentService: PlanningAssignmentsService
  ) {
    super(injector);
    this.isCustomSearch = true;
  }

  tableConfigConcurentProcess: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };
  tableConfigContractProcessInfo: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };

  tableConfigInsuranceSalaryProcess: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };

  tableConfigPositionSalary: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };

  tableConfigAllowanceProcess: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };

  tableConfigPlanningAssignment: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };


  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  showWorkInfo() {
    this.workInfos = this.data?.workInfo;
    return this.workInfos;
  }

  viewDetail() {
    this.isDetail = !this.isDetail;
    if (this.isDetail) {
      this.search(1, '', false);
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunctionWorkProcess = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.HR_WORK_PROCESS}`);
    this.objFunctionConcurrentProcess = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.HR_CONCURRENT_PROCESS}`);
    this.objFunctionContactProcess = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.HR_CONTRACT_PROCESS}`);
    this.objFunctionSalaryProgress = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.HR_INSURANCE_SALARY_PROCESS}`);
    this.objFunctionPositionSalary = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.HR_POSITION_SALARY_PROCESS}`);
    this.objFunctionAllowanceProcess = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.HR_ALLOWANCE_PROCESS}`);
    this.objFunctionPlanningAssignment = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.HR_PLANNING_ASSIGNMENTS}`);
    this.shareService.employee$.subscribe(emp => {
      if (emp?.employeeId) {
        this.employeeId = emp.employeeId;
        this.isDetail = false;
      }
    });
    this.initAction();
  }

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
    if (data.tableType === 'workProcess') {
      return this.objFunctionWorkProcess?.edit;
    }
    if (data.tableType === 'concurrentProcess') {
      return this.objFunctionConcurrentProcess?.edit;
    }
    if (data.tableType === 'contactProcess') {
      return this.objFunctionContactProcess?.edit;
    }
    if (data.tableType === 'salaryProgress') {
      return this.objFunctionSalaryProgress?.edit;
    }
    if (data.tableType === 'positionSalary') {
      return this.objFunctionPositionSalary?.edit;
    }
    if (data.tableType === 'allowanceProcess') {
      return this.objFunctionAllowanceProcess?.edit;
    }
    if (data.tableType === 'planningAssignment') {
      return this.objFunctionPlanningAssignment?.edit;
    }
    return true;
  };

  isShowDelete = (data: any): boolean => {
    if (data.tableType === 'workProcess') {
      return this.objFunctionWorkProcess?.delete;
    }
    if (data.tableType === 'concurrentProcess') {
      return this.objFunctionConcurrentProcess?.delete;
    }
    if (data.tableType === 'contactProcess') {
      return this.objFunctionContactProcess?.delete;
    }
    if (data.tableType === 'salaryProgress') {
      return this.objFunctionSalaryProgress?.delete;
    }
    if (data.tableType === 'positionSalary') {
      return this.objFunctionPositionSalary?.delete;
    }
    if (data.tableType === 'allowanceProcess') {
      return this.objFunctionAllowanceProcess?.delete;
    }
    if (data.tableType === 'planningAssignment') {
      return this.objFunctionPlanningAssignment?.delete;
    }
    return true;
  };

  doOpenFormCustom(type: string) {
    this.addWidth = type === 'workProcess' ? (window.innerWidth > 1110 ? (window.innerWidth - 1110) / 2 : window.innerWidth / 3) : 0;
    const formConfigMap: { [key: string]: any } = {
      workProcess: { title: 'hrm.staffManager.staffResearch.pageName.workProcessInfo', content: WpsFormComponent },
      concurrentProcess: {
        title: 'hrm.staffManager.staffResearch.pageName.concurrentProcessInfo',
        content: ConcurrentProcessFormComponent
      },
      contactProcess: {
        title: 'hrm.staffManager.staffResearch.pageName.contractProcessInfo',
        content: ContractProcessFormComponent
      },
      salaryProgress: {
        title: 'hrm.staffManager.staffResearch.pageName.insuranceSalaryInfo',
        content: IpsFormComponent
      },
      positionSalary: {
        title: 'hrm.staffManager.staffResearch.pageName.positionSalaryInfo',
        content: PspFormComponent
      },
      allowanceProcess: {
        title: 'hrm.staffManager.staffResearch.pageName.allowanceProcessInfo',
        content: ApsFormComponent
      },
      planningAssignment: {
        title: 'hrm.staffManager.staffResearch.pageName.planningAssignmentInfo',
        content: PasFormComponent
      }
    };

    this.formConfig = formConfigMap[type];
    this.doOpenForm(this.modeConst.ADD, { hiddenEmp: true, employeeId: this.employeeId });
  }

  doOpenFormEditCustom = (data: any) => {
    this.addWidth = data?.tableType === 'workProcess' ? (window.innerWidth > 1110 ? (window.innerWidth - 1110) / 2 : window.innerWidth / 3) : 0;

    if (data.tableType === 'workProcess') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.workProcessInfo',
        content: WpsFormComponent,
        isCloseModal: true
      };
    }
    if (data.tableType === 'concurrentProcess') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.concurrentProcessInfo',
        content: ConcurrentProcessFormComponent
      };
    }
    if (data.tableType === 'contactProcess') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.contractProcessInfo',
        content: ContractProcessFormComponent
      };
    }
    if (data.tableType === 'salaryProgress') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.insuranceSalaryInfo',
        content: IpsFormComponent
      };
    }
    if (data.tableType === 'positionSalary') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.positionSalaryInfo',
        content: PspFormComponent
      };
    }
    if (data.tableType === 'allowanceProcess') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.allowanceProcessInfo',
        content: ApsFormComponent
      };
    }
    if (data.tableType === 'planningAssignment') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.planningAssignmentInfo',
        content: PasFormComponent
      };
    }

    this.doOpenFormEdit({ ...data, hiddenEmp: true });
  };

  deleteItemCustom = (data: any) => {
    if (data.tableType === 'workProcess') {
      this.key = 'workProcessId';
      this.deleteApi = (id: number | string) => this.workInfoService.deleteById(id.toString(), '/' + this.employeeId);
    }
    if (data.tableType === 'concurrentProcess') {
      this.key = 'concurrentProcessId';
      this.deleteApi = (id: number | string) => this.concurrentProcessInfoService.deleteById(id.toString(), '/' + this.employeeId);
    }
    if (data.tableType === 'contactProcess') {
      this.key = 'contractProcessId';
      this.deleteApi = (id: number | string) => this.contactInfoService.deleteById(id.toString(), '/' + this.employeeId);
    }
    if (data.tableType === 'salaryProgress') {
      this.key = 'insuranceSalaryProcessId';
      this.deleteApi = (id: number | string) => this.salaryProcessService.deleteById(id.toString(), '/' + this.employeeId);
    }
    if (data.tableType === 'positionSalary') {
      this.key = 'positionSalaryProcessId';
      this.deleteApi = (id: number | string) => this.positionSalaryProcessService.deleteById(id.toString(), '/' + this.employeeId);
    }

    if (data.tableType === 'allowanceProcess') {
      this.key = 'allowanceProcessId';
      this.deleteApi = (id: number | string) => this.allowanceProcessService.deleteById(id.toString(), '/' + this.employeeId);
    }

    if (data.tableType === 'planningAssignment') {
      this.key = 'planningAssignmentId';
      this.deleteApi = (id: number | string) => this.planningAssignmentService.deleteById(id.toString(), '/' + this.employeeId);
    }

    this.deleteItem(data);
  };

  search(page?: number, type = '', isAlertModal = true) {
    if (isAlertModal) {
      this.alertModalChangeService.closeStaffInfo();
    }
    this.pagination.pageNumber = page ?? 1;
    if ((type === 'workProcess' || type === '') && this.objFunctionWorkProcess?.view) {
      this.workInfoService.getTableList(this.employeeId, this.pagination.getCurrentPage()).subscribe(res => {
        this.tableDataWorkProcess = res.data.listData.map(el => {
          el.positionNameStr = [el.positionName, el.jobName].filter(Boolean).join(', ');
          return { ...el, tableType: 'workProcess' };
        });
        this.tableConfig.total = res.data.total;
        this.tableConfig.pageIndex = res.data.pageIndex;
      });
    }
    if ((type === 'concurrentProcess' || type === '') && this.objFunctionConcurrentProcess?.view) {
      this.concurrentProcessInfoService.getTableList(this.employeeId, this.pagination.getCurrentPage()).subscribe(res => {
        this.tableDataConcurrentProcess = res.data.listData.map(el => {
          return { ...el, tableType: 'concurrentProcess' };
        });
        this.tableConfigConcurentProcess.total = res.data.total;
        this.tableConfigConcurentProcess.pageIndex = res.data.pageIndex;
      });
    }
    if ((type === 'contactProcess' || type === '') && this.objFunctionContactProcess?.view) {
      this.contactInfoService.getTableList(this.employeeId, this.pagination.getCurrentPage()).subscribe(res => {
        this.tableDataContractProcess = res.data.listData.map(el => {
          return { ...el, tableType: 'contactProcess' };
        });
        this.tableConfigContractProcessInfo.total = res.data.total;
        this.tableConfigContractProcessInfo.pageIndex = res.data.pageIndex;
      });
    }
    if ((type === 'salaryProgress' || type === '') && this.objFunctionSalaryProgress?.view) {
      this.salaryProcessService.getTableList(this.employeeId, this.pagination.getCurrentPage()).subscribe(res => {
        this.tableDataInsuranceSalary = res.data.listData.map(el => {
          return { ...el, tableType: 'salaryProgress' };
        });
        this.tableConfigInsuranceSalaryProcess.total = res.data.total;
        this.tableConfigInsuranceSalaryProcess.pageIndex = res.data.pageIndex;
      });
    }
    if ((type === 'positionSalary' || type === '') && this.objFunctionPositionSalary?.view) {
      this.positionSalaryProcessService.getTableList(this.employeeId, this.pagination.getCurrentPage()).subscribe(res => {
        this.tableDataPositionSalary = res.data.listData.map(el => {
          return { ...el, tableType: 'positionSalary' };
        });
        this.tableConfigPositionSalary.total = res.data.total;
        this.tableConfigPositionSalary.pageIndex = res.data.pageIndex;
      });
    }
    if ((type === 'allowanceProcess' || type === '') && this.objFunctionAllowanceProcess?.view) {
      this.allowanceProcessService.getTableList(this.employeeId, this.pagination.getCurrentPage()).subscribe(res => {
        this.tableDataAllowanceProcess = res.data.listData.map(el => {
          return { ...el, tableType: 'allowanceProcess' };
        });
        this.tableConfigAllowanceProcess.total = res.data.total;
        this.tableConfigAllowanceProcess.pageIndex = res.data.pageIndex;
      });
    }
    if ((type === 'planningAssignment' || type === '') && this.objFunctionPlanningAssignment?.view) {
      this.planningAssignmentService.getTableList(this.employeeId, this.pagination.getCurrentPage()).subscribe(res => {
        this.tableDataPlanningAssignment = res.data.listData.map(el => {
          return { ...el, tableType: 'planningAssignment' };
        });
        this.tableConfigPlanningAssignment.total = res.data.total;
        this.tableConfigPlanningAssignment.pageIndex = res.data.pageIndex;
      });
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
        title: 'hrm.staffManager.staffResearch.workHis.table.fromDate',
        field: 'startDate',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'hrm.staffManager.staffResearch.workHis.table.toDate',
        field: 'endDate',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'hrm.staffManager.staffResearch.workHis.table.documentType',
        field: 'documentTypeName'
      },
      {
        title: 'hrm.staffManager.staffResearch.workHis.table.processOrgName',
        field: 'orgName'
      },
      {
        title: 'hrm.staffManager.staffResearch.workHis.table.processPosName',
        field: 'positionNameStr'
      },
      {
        title: 'hrm.staffManager.staffResearch.workHis.table.processOtherPosName',
        field: 'otherPositionName'
      },
      {
        title: 'hrm.staffManager.staffResearch.workHis.table.documentNo',
        field: 'documentNo',
        width: 150,
        show: false
      },
      {
        title: 'hrm.staffManager.staffResearch.workHis.table.signedDate',
        field: 'documentSignedDate',
        width: 150,
        show: false
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

    this.tableConfigConcurentProcess.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixedDir: 'left',
        width: 50,
        fixed: window.innerWidth > 1024
      },
      {
        title: 'hrm.staffManager.staffResearch.concurrentProcess.label.fromDate',
        field: 'startDate',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'hrm.staffManager.staffResearch.concurrentProcess.label.toDate',
        field: 'endDate',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'hrm.staffManager.staffResearch.concurrentProcess.label.documentNo',
        field: 'documentNo',
        width: 150,
        show: false
      },
      {
        title: 'hrm.staffManager.staffResearch.concurrentProcess.label.concurrentOrg',
        field: 'concurrentOrg'
      },
      {
        title: 'hrm.staffManager.staffResearch.concurrentProcess.label.concurrentPos',
        field: 'concurrentJob'
      },
      {
        title: 'hrm.staffManager.staffResearch.concurrentProcess.label.signedDate',
        field: 'documentSignedNo',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 120,
        show: false
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

    this.tableConfigContractProcessInfo.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixedDir: 'left',
        width: 50,
        fixed: window.innerWidth > 1024
      },
      {
        title: 'hrm.staffManager.staffResearch.contractHis.table.fromDate',
        field: 'startDate',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'hrm.staffManager.staffResearch.contractHis.table.toDate',
        field: 'endDate',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'hrm.staffManager.staffResearch.personalInformation.table.empTypeName',
        field: 'empTypeName'
      },
      {
        title: 'hrm.staffManager.staffResearch.contractHis.table.contractTypeName',
        field: 'contractTypeName'
      },
      {
        title: 'hrm.staffManager.staffResearch.contractHis.table.signedDate',
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

    this.tableConfigInsuranceSalaryProcess.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixedDir: 'left',
        width: 50,
        fixed: window.innerWidth > 1024
      },
      {
        title: 'hrm.staffManager.staffResearch.salary.table.fromDate',
        field: 'startDate',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'hrm.staffManager.staffResearch.salary.table.toDate',
        field: 'endDate',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 150
      },      
      {
        title: 'hrm.staffManager.staffResearch.salary.table.salaryRankName',
        field: 'salaryRankName'
      },
      {
        title: 'hrm.staffManager.staffResearch.salary.table.salaryGradeName',
        field: 'salaryGradeName'
      },
      {
        title: 'hrm.staffManager.insuranceSalaryProcess.table.amount',
        field: 'amount',
        width: 120,
        fieldType: 'pipe',
        tdClassList: ['text-right'],
        fieldTypeValue: 'currency'
      },
      {
        title: 'hrm.staffManager.staffResearch.salary.table.salaryPercent',
        field: 'percent',
        width: 100,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'hrm.staffManager.staffResearch.salary.table.reserveFactor',
        field: 'reserveFactor'
      },
      {
        title: 'hrm.staffManager.staffResearch.salary.table.documentNo',
        field: 'documentNo'
      },
      {
        title: 'hrm.staffManager.staffResearch.salary.table.documentSignedDate',
        field: 'documentSignedDate',
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
    this.tableConfigPositionSalary.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixedDir: 'left',
        width: 50,
        fixed: window.innerWidth > 1024
      },
      {
        title: 'hrm.staffManager.positionSalaryProcess.table.startDate',
        field: 'startDate',
        width: 150,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'hrm.staffManager.positionSalaryProcess.table.endDate',
        field: 'endDate',
        width: 150,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'hrm.staffManager.insuranceSalaryProcess.table.salaryType',
        field: 'salaryTypeName'
      },
      {
        title: 'hrm.staffManager.positionSalaryProcess.table.jobName',
        field: 'jobName'
      },
      {
        title: 'hrm.staffManager.positionSalaryProcess.table.salaryRankId',
        field: 'salaryRankName',
        width: 150
      },
      {
        title: 'hrm.staffManager.positionSalaryProcess.table.salaryGradeId',
        field: 'salaryGradeName',
        width: 150
      },
      {
        title: 'hrm.staffManager.positionSalaryProcess.table.percent',
        field: 'percent',
        width: 80,
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
    this.tableConfigAllowanceProcess.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixedDir: 'left',
        width: 50,
        fixed: window.innerWidth > 1024
      },
      {
        title: 'hrm.staffManager.staffResearch.allowanceHis.table.fromDate',
        field: 'startDate',
        width: 150,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'hrm.staffManager.staffResearch.allowanceHis.table.toDate',
        field: 'endDate',
        width: 150,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      }, {
        title: 'hrm.staffManager.staffResearch.allowanceHis.table.allowanceTypeName',
        field: 'allowanceTypeName'
      },
      {
        title: 'hrm.staffManager.staffResearch.allowanceHis.table.amountMoney',
        field: 'amount',
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'hrm.staffManager.staffResearch.allowanceHis.table.documentNo',
        field: 'documentNo',
        thClassList: ['text-center']
      },
      {
        title: 'hrm.staffManager.staffResearch.allowanceHis.table.documentSignedDate',
        field: 'documentSignedDate',
        thClassList: ['text-center'],
        tdClassList: ['text-center']
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
    this.tableConfigPlanningAssignment.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixedDir: 'left',
        width: 50,
        fixed: window.innerWidth > 1024
      },
      {
        title: 'hrm.staffManager.staffResearch.planningAssignment.table.planningPeriodId',
        field: 'planningPeriodName',
        width: 120
      },
      {
        title: 'hrm.staffManager.staffResearch.planningAssignment.table.positionId',
        field: 'positionName',
        width: 120
      },
      {
        title: 'hrm.staffManager.staffResearch.planningAssignment.table.documentNo',
        field: 'documentNo',
        width: 120
      },
      {
        title: 'hrm.staffManager.staffResearch.planningAssignment.table.documentSignedDate',
        field: 'documentSignedDate',
        width: 120
      },
      {
        title: 'hrm.staffManager.staffResearch.planningAssignment.table.startDate',
        field: 'startDate',
        width: 120
      },
      {
        title: 'hrm.staffManager.staffResearch.planningAssignment.table.endDate',
        field: 'endDate',
        width: 120
      },
      {
        title: 'hrm.staffManager.staffResearch.planningAssignment.table.endReasonId',
        field: 'endReasonName',
        width: 120
      },
      {
        title: 'hrm.staffManager.staffResearch.planningAssignment.table.endDocumentNo',
        field: 'endDocumentNo',
        width: 120
      },
      {
        title: 'hrm.staffManager.staffResearch.planningAssignment.table.endDocumentSignedDate',
        field: 'endDocumentSignedDate',
        width: 120
      },
      {
        title: 'hrm.staffManager.staffResearch.planningAssignment.table.flagStatus',
        field: 'empStatusName',
        width: 120,
        show: false
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

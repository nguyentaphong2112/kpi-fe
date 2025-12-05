import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { AppFunction } from '@app/core/models/app-function.interface';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Subscription } from 'rxjs';
import { BaseListComponent } from '@core/components/base-list.component';
import { EmployeesInfo, InfoDetailBean } from '@app/modules/hrm/data-access/models/employee-info';
import { BaseResponse } from '@core/models/base-response';
import { HBTTableConfig } from '@shared/component/hbt-table/hbt-table.interfaces';
import { TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { IdentityInfoService } from '@app/modules/hrm/data-access/services/staff-info/identity-info.service';
import { BankInfoService } from '@app/modules/hrm/data-access/services/staff-info/bank-info.service';
import { FunctionCode } from '@shared/enums/enums-constant';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { PiyFormComponent } from '@app/modules/hrm/pages/staff-research/personal-identity/piy-form/piy-form.component';
import { WorkBeforeHisService } from '@app/modules/hrm/data-access/services/staff-info/work-before-his.service';
import { WhyFormComponent } from '@app/modules/hrm/pages/staff-research/worked-history/why-form/why-form.component';
import { BatFormComponent } from '@app/modules/hrm/pages/staff-research/bank-account/bat-form/bat-form.component';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { AlertModalChangeService } from '@app/modules/hrm/data-access/services/staff-info/alert-modal-change.service';

@Component({
  selector: 'app-pin-index',
  templateUrl: './pin-index.component.html',
  styleUrls: ['./pin-index.component.scss']
})
export class PinIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit, OnDestroy {

  objFunction: AppFunction;
  objFunctionBankAccount: AppFunction;
  objFunctionWorkHistory: AppFunction;
  items: EmployeesInfo | NzSafeAny;
  subs: Subscription[] = [];
  response: BaseResponse<any> = new BaseResponse();
  personalInfo: InfoDetailBean[] = [];
  isDetail = false;
  tableDataIdentity: NzSafeAny[] = [];
  tableDataBank: NzSafeAny[] = [];
  tableDataWorkHistory: NzSafeAny[] = [];
  employeeId: any;


  tableConfigAccount: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };

  tableConfigWorkProcess: HBTTableConfig = {
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
    private identityInfoService: IdentityInfoService,
    private bankInfoService: BankInfoService,
    private alertModalChangeService: AlertModalChangeService,
    private workBeforeHisService: WorkBeforeHisService
  ) {
    super(injector);
    this.isCustomSearch = true;
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.PERSONAL_PERSONAL_IDENTITIES}`);
    this.objFunctionBankAccount = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.PERSONAL_BANK_ACCOUNTS}`);
    this.objFunctionWorkHistory = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.PERSONAL_WORKED_HISTORIES}`);
    this.initAction();
    this.employeeId = 1;
  }

  showPersonalInfo() {
    this.personalInfo = this.data?.personalInfo;
    return this.personalInfo;
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
    if (data.tableType === 'identity') {
      return this.objFunction?.edit;
    }
    if (data.tableType === 'bankAccount') {
      return this.objFunctionBankAccount?.edit;
    }
    if (data.tableType === 'workHistory') {
      return this.objFunctionWorkHistory?.edit;
    }
    return true;
  };

  isShowDelete = (data: any): boolean => {
    if (data.tableType === 'identity') {
      return this.objFunction?.delete;
    }
    if (data.tableType === 'bankAccount') {
      return this.objFunctionBankAccount?.delete;
    }
    if (data.tableType === 'workHistory') {
      return this.objFunctionWorkHistory?.delete;
    }
    return true;
  };

  doOpenFormCustom(type: string) {
    const formConfigMap: { [key: string]: any } = {
      identity: {
        title: 'hrm.staffManager.staffResearch.pageName.identityInfo', content: PiyFormComponent,
        config: UrlConstant.EMPLOYEES.PERSONAL
      },
      bankAccount: {
        title: 'hrm.staffManager.staffResearch.pageName.bankAccountInfo', content: BatFormComponent,
        config: UrlConstant.EMPLOYEES.PERSONAL
      },
      workHistory: {
        title: 'hrm.staffManager.label.workProcessHistory', content: WhyFormComponent,
        config: UrlConstant.EMPLOYEES.PERSONAL
      }
    };

    this.formConfig = formConfigMap[type];
    this.doOpenForm(this.modeConst.ADD, { hiddenEmp: true, employeeId: this.employeeId });
  }


  doOpenFormEditCustom = (data: any) => {
    if (data.tableType === 'identity') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.identityInfo',
        content: PiyFormComponent,
        config: UrlConstant.EMPLOYEES.PERSONAL
      };
    }
    if (data.tableType === 'bankAccount') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.bankAccountInfo',
        content: BatFormComponent,
        config: UrlConstant.EMPLOYEES.PERSONAL
      };
    }
    if (data.tableType === 'workHistory') {
      this.formConfig = {
        title: 'hrm.staffManager.label.workProcessHistory',
        content: WhyFormComponent,
        config: UrlConstant.EMPLOYEES.PERSONAL
      };
    }
    this.doOpenFormEdit({ ...data, hiddenEmp: true });
  };

  deleteItemCustom = (data: any) => {
    if (data.tableType === 'identity') {
      this.key = 'personalIdentityId';
      this.deleteApi = (id: number | string) => this.identityInfoService.deleteById(id.toString(), UrlConstant.EMPLOYEES.PERSONAL);
    }
    if (data.tableType === 'bankAccount') {
      this.key = 'bankAccountId';
      this.deleteApi = (id: number | string) => this.bankInfoService.deleteById(id.toString(), UrlConstant.EMPLOYEES.PERSONAL);
    }
    if (data.tableType === 'workHistory') {
      this.key = 'workedHistoryId';
      this.deleteApi = (id: number | string) => this.workBeforeHisService.deleteById(id.toString(), UrlConstant.EMPLOYEES.PERSONAL);
    }
    this.deleteItem(data);
  };

  viewDetail() {
    this.isDetail = !this.isDetail;
    if (this.isDetail) {
      this.search(1, '', false);
    }
  }


  search(page?: number, type = '', isAlertModal = true) {
    if (isAlertModal) {
      this.alertModalChangeService.closePersonalInfo();
    }
    this.pagination.pageNumber = page ?? 1;
    if ((type === 'identity' || type === '') && this.objFunction?.view) {
      this.identityInfoService.getIdentityInfo(null, this.pagination.getCurrentPage()).subscribe(res => {
        this.tableDataIdentity = res.data.listData.map(el => {
          return { ...el, tableType: 'identity' };
        });
        this.tableConfig.total = res.data.total;
        this.tableConfig.pageIndex = res.data.pageIndex;
      });
    }
    if ((type === 'bankAccount' || type === '') && this.objFunctionBankAccount?.view) {
      this.bankInfoService.getBankInfo(null, this.pagination.getCurrentPage()).subscribe((res => {
        this.tableDataBank = res.data.listData.map(el => {
          return { ...el, tableType: 'bankAccount' };
        });
        this.tableConfigAccount.total = res.data.total;
        this.tableConfigAccount.pageIndex = res.data.pageIndex;
      }));
    }
    if ((type === 'workHistory' || type === '') && this.objFunctionWorkHistory?.view) {
      this.workBeforeHisService.getTableList(null, this.pagination.getCurrentPage()).subscribe(res => {
        this.tableDataWorkHistory = res.data.listData.map(el => {
          return { ...el, tableType: 'workHistory' };
        });
        this.tableConfigWorkProcess.total = res.data.total;
        this.tableConfigWorkProcess.pageIndex = res.data.pageIndex;
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
        title: 'hrm.staffManager.staffResearch.identity.table.label',
        field: 'identityTypeName'
      },
      {
        title: 'hrm.staffManager.staffResearch.identity.table.idNo',
        field: 'identityNo'
      },
      {
        title: 'hrm.staffManager.staffResearch.identity.table.idIssuePlace',
        field: 'identityIssuePlace'
      },
      {
        title: 'hrm.staffManager.staffResearch.identity.table.idIssueDate',
        field: 'identityIssueDate',
        width: 150,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'hrm.staffManager.staffResearch.identity.table.expiredDate',
        field: 'expiredDate',
        width: 150,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'hrm.staffManager.staffResearch.identity.table.isMain',
        field: 'isMain',
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

    this.tableConfigAccount.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixedDir: 'left',
        width: 50,
        fixed: window.innerWidth > 1024
      },
      {
        title: 'hrm.staffManager.table.accountNumber',
        field: 'accountNo'
      },
      {
        title: 'hrm.staffManager.table.bank',
        field: 'accountTypeName'
      },
      {
        title: 'hrm.staffManager.table.branch',
        field: 'bankBranch',
        width: 120
      },
      {
        title: 'hrm.staffManager.table.accountMain',
        field: 'isMain',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 120
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

    this.tableConfigWorkProcess.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixedDir: 'left',
        width: 50,
        fixed: window.innerWidth > 1024
      },
      {
        title: 'hrm.staffManager.staffResearch.workHisBefore.table.fromMonth',
        field: 'startDate',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'hrm.staffManager.staffResearch.workHisBefore.table.toMonth',
        field: 'endDate',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'hrm.staffManager.staffResearch.workHisBefore.table.organizationName',
        field: 'companyName'
      },
      {
        title: 'hrm.staffManager.staffResearch.workHisBefore.table.positionName',
        field: 'job'
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

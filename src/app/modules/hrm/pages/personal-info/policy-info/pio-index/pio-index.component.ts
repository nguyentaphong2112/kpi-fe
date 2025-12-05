import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { InfoDetailBean } from '@app/modules/hrm/data-access/models/employee-info';
import { AlertModalChangeService } from '@app/modules/hrm/data-access/services/staff-info/alert-modal-change.service';
import { AppFunction } from '@core/models/app-function.interface';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { PonFormComponent } from '@app/modules/hrm/pages/staff-research/participation/pon-form/pon-form.component';
import { PoliticalParticipationsService } from '@app/modules/hrm/data-access/services/staff-research/political-participations.service';
import { FunctionCode } from '@shared/enums/enums-constant';
import { ShareDataService } from '@shared/services/share-data.service';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';

@Component({
  selector: 'app-pio-index',
  templateUrl: './pio-index.component.html',
  styleUrls: ['./pio-index.component.scss']
})
export class PioIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit, OnDestroy {
  objFunctionParticipation: AppFunction;
  policyInfo: InfoDetailBean[] = [];
  isDetail = false;
  employeeId: any;


  @Input() data: any;

  constructor(
    injector: Injector,
    private participationService: PoliticalParticipationsService,
    private shareService: ShareDataService,
    private alertModalChangeService: AlertModalChangeService
  ) {
    super(injector);
    this.isCustomSearch = true;
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunctionParticipation = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.PERSONAL_POLITICAL_PARTICIPATION}`);
    this.employeeId = 1;
    this.initAction();
  }

  showPersonalInfo() {
    this.policyInfo = this.data?.policyInfo;
    return this.policyInfo;
  }

  viewDetail() {
    this.isDetail = !this.isDetail;
    if (this.isDetail) {
      this.search(1, '', false);
    }
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

  deleteItemCustom = (data: any) => {
    if (data.tableType === 'participation') {
      this.key = 'participationId';
      this.deleteApi = (id: number | string) => this.participationService.deleteById(id.toString(), UrlConstant.EMPLOYEES.PERSONAL);
    }
    this.deleteItem(data);
  };


  doOpenFormEditCustom = (data: any) => {
    if (data.tableType === 'participation') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.participation',
        content: PonFormComponent, config: UrlConstant.EMPLOYEES.PERSONAL
      };
    }
    this.doOpenFormEdit({ ...data, hiddenEmp: true });
  };

  isShowEdit = (data: any): boolean => {
    if (data.tableType === 'participation') {
      return this.objFunctionParticipation?.edit;
    }
    return true;
  };

  isShowDelete = (data: any): boolean => {
    if (data.tableType === 'participation') {
      return this.objFunctionParticipation?.delete;
    }
    return true;
  };

  search(page?: number, type = '', isAlertModal = true) {
    if (isAlertModal) {
      this.alertModalChangeService.closeStaffInfo();
    }
    this.pagination.pageNumber = page ?? 1;
    if ((type === 'participation' || type === '') && this.objFunctionParticipation?.view) {
      this.participationService.getParticipation(null, this.pagination.getCurrentPage()).subscribe(res => {
        this.tableData = res.data.listData.map(el => {
          return { ...el, tableType: 'participation' };
        });
        this.tableConfig.total = res.data.total;
        this.tableConfig.pageIndex = res.data.pageIndex;
      });
    }
  };

  doOpenFormCustom(type: string) {
    const formConfigMap: { [key: string]: any } = {
      participation: {
        title: 'hrm.staffManager.staffResearch.pageName.participation',
        content: PonFormComponent,
        config: UrlConstant.EMPLOYEES.PERSONAL
      }
    };

    this.formConfig = formConfigMap[type];
    this.doOpenForm(this.modeConst.ADD, { hiddenEmp: true, employeeId: this.employeeId });
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
        title: 'hrm.staffManager.participation.table.fromDate',
        field: 'startDate',
        width: 120
      },
      {
        title: 'hrm.staffManager.participation.table.toDate',
        field: 'endDate',
        width: 120
      },
      {
        title: 'hrm.staffManager.participation.table.orgType',
        field: 'organizationTypeName'
      },
      {
        title: 'hrm.staffManager.participation.table.positionTitle',
        field: 'positionTitleName'
      },
      {
        title: 'hrm.staffManager.participation.table.organizationName',
        field: 'organizationName'
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

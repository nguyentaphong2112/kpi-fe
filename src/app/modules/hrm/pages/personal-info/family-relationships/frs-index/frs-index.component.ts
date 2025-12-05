import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { AppFunction } from '@core/models/app-function.interface';
import { FunctionCode } from '@shared/enums/enums-constant';
import { BaseResponse } from '@core/models/base-response';
import { EmployeesInfo, InfoDetailBean } from '@app/modules/hrm/data-access/models/employee-info';
import { BaseListComponent } from '@core/components/base-list.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import {
  FamilyRelationshipService
} from '@app/modules/hrm/data-access/services/staff-info/family-relationship.service';
import {
  FrpFormComponent
} from '@app/modules/hrm/pages/staff-research/family-relationship/frp-form/frp-form.component';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { AlertModalChangeService } from '@app/modules/hrm/data-access/services/staff-info/alert-modal-change.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './frs-index.component.html',
  styleUrls: ['./frs-index.component.scss']
})
export class FrsIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit, OnDestroy {
  objFunction: AppFunction;
  items: EmployeesInfo | NzSafeAny;
  subs: Subscription[] = [];
  response: BaseResponse<any> = new BaseResponse();
  familyRelationShipInfo: InfoDetailBean[] = [];
  tableDataFrs: NzSafeAny[] = [];
  isDetail = false;
  employeeId: any;

  @Input() data: any;

  constructor(
    injector: Injector,
    private alertModalChangeService: AlertModalChangeService,
    private familyRelationshipService: FamilyRelationshipService
  ) {
    super(injector);
    this.isCustomSearch = true;
  }

  showFamilyInfo() {
    this.familyRelationShipInfo = this.data?.familyRelationShipInfo;
    return this.familyRelationShipInfo;
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.PERSONAL_FAMILY_RELATIONSHIPS}`);
    this.initAction();
    this.employeeId = 1;
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
    if (data.tableType === 'familyRelationships') {
      return this.objFunction?.edit;
    }
    return true;
  };

  isShowDelete = (data: any): boolean => {
    if (data.tableType === 'familyRelationships') {
      return this.objFunction?.delete;
    }
    return true;
  };

  deleteItemCustom = (data: any) => {
    if (data.tableType === 'familyRelationships') {
      this.key = 'familyRelationshipId';
      this.deleteApi = (id: number | string) => this.familyRelationshipService.deleteById(id.toString(), UrlConstant.EMPLOYEES.PERSONAL);
    }
    this.deleteItem(data);
  };

  doOpenFormEditCustom = (data: any) => {
    if (data.tableType === 'familyRelationships') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.familyRelationshipInfo',
        content: FrpFormComponent, config: UrlConstant.EMPLOYEES.PERSONAL
      };
    }
    this.doOpenFormEdit({ ...data, hiddenEmp: true });
  };

  doOpenFormCustom(type: string) {
    const formConfigMap: { [key: string]: any } = {
      familyRelationships: {
        title: 'hrm.staffManager.staffResearch.pageName.familyRelationshipInfo',
        content: FrpFormComponent,
        config: UrlConstant.EMPLOYEES.PERSONAL
      }
    };

    this.formConfig = formConfigMap[type];
    this.doOpenForm(this.modeConst.ADD, { hiddenEmp: true, employeeId: this.employeeId });
  }

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
    if ((type === 'familyRelationships' || type === '') && this.objFunction?.view) {
      this.familyRelationshipService.getTabeList(null, this.pagination.getCurrentPage()).subscribe(res => {
        this.tableDataFrs = res.data.listData.map(el => {
          return { ...el, tableType: 'familyRelationships' };
        });
        this.tableConfig.total = res.data.total;
        this.tableConfig.pageIndex = res.data.pageIndex;
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
        title: 'hrm.staffManager.staffResearch.relatives.table.relationTypeCode',
        field: 'relationTypeName'
      },
      {
        title: 'hrm.staffManager.staffResearch.relatives.table.fullName',
        field: 'familyRelationshipName'
      },
      {
        title: 'hrm.staffManager.staffResearch.relatives.table.dateOfBirth',
        field: 'dateOfBirthStr',
        width: 200,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'hrm.staffManager.staffResearch.relatives.table.relationStatusCode',
        field: 'relationStatusName',
        width: 200
      },
      {
        title: 'hrm.staffManager.staffResearch.relatives.table.policyTypeCode',
        field: 'policyTypeName',
        width: 200
      },
      {
        title: 'hrm.staffManager.staffResearch.relatives.table.isForeign',
        field: 'isForeign',
        width: 150
      },
      {
        title: 'hrm.staffManager.staffResearch.relatives.table.personalIdNumber',
        field: 'personalIdNo',
        width: 150,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        show: false
      },
      {
        title: 'hrm.staffManager.staffResearch.relatives.table.phoneNumber',
        field: 'mobileNumber',
        width: 100,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        show: false
      },
      {
        title: 'hrm.staffManager.staffResearch.relatives.table.workOrganization',
        field: 'organizationAddress',
        width: 150,
        show: false
      },
      {
        title: 'hrm.staffManager.staffResearch.relatives.table.currentAddress',
        field: 'currentAddress',
        width: 150,
        show: false
      },
      {
        title: 'common.label.createdBy',
        field: 'createdBy',
        width: 80,
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
        width: 80,
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

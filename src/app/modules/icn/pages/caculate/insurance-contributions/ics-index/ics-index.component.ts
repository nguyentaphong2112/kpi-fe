import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  InsuranceContributionsService
} from '../../../../data-access/services/caculate/insurance-contributions.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { Scopes } from '@core/utils/common-constants';
import { Constant } from '@app/modules/icn/data-access/constants/constant';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {
  ChangeListComponent
} from '@app/modules/icn/pages/caculate/insurance-contributions/change-list/change-list.component';
import { format } from 'date-fns';
import {
  ArrearsPrePeriodViewComponent
} from '@app/modules/icn/pages/caculate/insurance-contributions/arrears-pre-period-view/arrears-pre-period-view.component';
import {
  ArrearsPreMedicalComponent
} from '@app/modules/icn/pages/caculate/insurance-contributions/arrears-pre-medical/arrears-pre-medical.component';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import {
  EmployeeInfoComponent
} from '@app/modules/icn/pages/caculate/insurance-contributions/employee-info/employee-info.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-ics-index',
  templateUrl: './ics-index.component.html',
  styleUrls: ['./ics-index.component.scss']
})


export class IcsIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  isShowAdvSearch = false;
  scope = Scopes.VIEW;
  functionCode = Constant.FUNCTION_CODE.ICN_INSURANCE_CONTRIBUTIONS;
  serviceName = MICRO_SERVICE.ICN;
  urlLoadEmpTypeList = UrlConstant.EMP_TYPES.GET_LIST;
  statusCodes = Constant.STATUS;
  typeList = Constant.TYPE;
  actionSchemaHeader: ActionSchema;

  @ViewChild('footerCancelTmpl', { static: true }) footerCancelTpl!: TemplateRef<any>;
  @ViewChild('employeeNameTmpl', { static: true }) employeeNameTpl!: TemplateRef<any>;
  @ViewChild('employeeCodeTmpl', { static: true }) employeeCodeTpl!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: InsuranceContributionsService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.FORM_DATA, '/import');
    this.key = 'insuranceContributionId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null],
      orgId: [null],
      periodDate: [new Date(), Validators.required],
      listEmpTypeCode: [null],
      listType: [null],
      listStatus: [null]
    });
  }


  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'icn.icnContribution.calculate.action.changeList',
          icon: 'edit',
          isShowFn: (evt: any) => [this.statusCodes.DU_THAO].includes(evt.status)
            && (evt.type == this.typeList.KO_THU || evt.type == this.typeList.THU_BHXH || evt.type == this.typeList.THAI_SAN)
            && this.objFunction?.edit,
          function: (evt: any) => this.onChangeList(evt)
        }),
        new ChildActionSchema({
          label: 'icn.icnContribution.calculate.action.approve',
          icon: 'check',
          isShowFn: (evt: any) => [this.statusCodes.DU_THAO].includes(evt.status) && this.objFunction?.approve,
          function: (evt: any) => this.onApprove(evt)
        }),
        new ChildActionSchema({
          label: 'icn.icnContribution.calculate.action.undoApprove',
          icon: 'close',
          isShowFn: (evt: any) => [this.statusCodes.PHE_DUYET].includes(evt.status) && this.objFunction?.approve,
          function: (evt: any) => this.onUndoApprove(evt)
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShowFn: (evt: any) => [this.statusCodes.DU_THAO].includes(evt.status)
            && (evt.type == this.typeList.TRUY_LINH || evt.type == this.typeList.TRUY_THU || evt.type == this.typeList.TRUY_THU_BHYT)
            && this.objFunction?.delete,
          function: this.deleteItem
        })
      ]
    });
    this.actionSchemaHeader = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.export',
          icon: 'export',
          isShow: true,
          function: () => {
            this.export();
          }
        }),
        new ChildActionSchema({
          label: 'icn.icnContribution.calculate.action.approve',
          icon: 'check',
          isShow: this.objFunction?.approve,
          function: () => {
            this.onApproveAll();
          }
        }),
        new ChildActionSchema({
          label: 'icn.icnContribution.calculate.action.undoApprove',
          icon: 'close',
          isShow: this.objFunction?.approve,
          function: () => {
            this.onUndoApproveAll();
          }
        }),
        new ChildActionSchema({
          label: 'icn.icnContribution.calculate.action.arrearsPrePeriod',
          icon: 'plus',
          isShow: this.objFunction?.create,
          function: () => this.onArrearsPrePeriod()
        }),
        new ChildActionSchema({
          label: 'icn.icnContribution.calculate.action.arrearsPreMedical',
          icon: 'plus',
          isShow: this.objFunction?.create,
          function: () => this.onArrearsPreMedical()
        })
      ]
    });
  }


  onArrearsPrePeriod() {
    const data = { periodDate: format(this.form.controls['periodDate'].value, 'dd/MM/yyyy') };
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth(),
      nzTitle: this.translate.instant('icn.icnContribution.calculate.titleArrearsPrePeriod'),
      nzContent: ArrearsPrePeriodViewComponent,
      nzComponentParams: {
        data
      },
      nzFooter: this.footerCancelTpl
    });
    this.modalRef.afterClose.subscribe((result) => {
        if (result?.refresh) {
          this.search();
        }
      }
    );
  }

  onArrearsPreMedical() {
    const data = { periodDate: format(this.form.controls['periodDate'].value, 'dd/MM/yyyy') };
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth(),
      nzTitle: this.translate.instant('icn.icnContribution.calculate.titleArrearsPreMedical'),
      nzContent: ArrearsPreMedicalComponent,
      nzComponentParams: {
        data
      },
      nzFooter: null
    });
    this.modalRef.afterClose.subscribe((result) => {
        if (result?.refresh) {
          this.search();
        }
      }
    );
  }

  onApproveAll() {
    const data = { ...this.form.value, periodDate: format(this.form.controls['periodDate'].value, 'dd/MM/yyyy') };
    this.service.approveAllPut(data)
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(this.translate.instant('common.notification.isApproveAll'));
          this.search();
        }
      });
  }

  onUndoApproveAll() {
    const data = { ...this.form.value, periodDate: format(this.form.controls['periodDate'].value, 'dd/MM/yyyy') };
    this.service.onUndoApproveAllPut(data)
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(this.translate.instant('common.notification.isNotApproveAll'));
          this.search();
        }
      });
  }


  onChangeList(data: any) {
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth(),
      nzTitle: this.translate.instant('icn.icnContribution.calculate.titleChangeList'),
      nzContent: ChangeListComponent,
      nzComponentParams: {
        data
      },
      nzFooter: this.footerTpl
    });
    this.modalRef.afterClose.subscribe((result) => {
        if (result?.refresh) {
          this.search();
        }
      }
    );
  }

  showEmployeeInfos(employeeId: number) {
    this.modalRef = this.modal.create({
      nzWidth: '70%',
      nzTitle: this.translate.instant('icn.icnContribution.calculate.titleEmployeeInfo'),
      nzContent: EmployeeInfoComponent,
      nzComponentParams: {
        employeeId,
        mode: Mode.VIEW
      },
      nzFooter: this.footerCancelTpl
    });
    this.modalRef.afterClose.subscribe((result) => {
        if (result?.refresh) {
          this.search();
        }
      }
    );
  }

  onApprove(dataItem: any) {
    const data = { listId: [dataItem[this.key]] };
    this.service.onChangeStatusById(data, REQUEST_TYPE.DEFAULT, '/approve-by-id')
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(this.translate.instant('common.notification.updateSuccess'));
          this.search();
        }
      });
  }

  onUndoApprove(dataItem: any) {
    const data = { listId: [dataItem[this.key]] };
    this.service.onChangeStatusById(data, REQUEST_TYPE.DEFAULT, '/undo-approve-by-id')
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(this.translate.instant('common.notification.updateSuccess'));
          this.search();
        }
      });
  }


  onMakeList() {
    const form = this.form.value;
    const data = { periodDate: format(form.periodDate, 'dd/MM/yyyy'), empCodes: form.keySearch ?? null };
    this.service.postParams(data, '/calculate').subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.makeListSuccess'));
        this.search();
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
        width: 50,
        rowspan: 2
      },

      {
        title: 'icn.icnContribution.calculate.model.employeeCode',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.employeeCodeTpl,
        width: 100,
        rowspan: 2,
        thClassList: ['text-center']
      },
      {
        title: 'icn.icnContribution.calculate.model.fullName',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.employeeNameTpl,
        rowspan: 2,
        width: 200,
        thClassList: ['text-center']
      },
      {
        title: 'icn.icnContribution.calculate.model.status',
        field: 'statusName',
        tdClassList: ['text-center'],
        rowspan: 2,
        width: 130
      },
      {
        title: 'icn.icnContribution.calculate.model.type',
        field: 'typeName',
        rowspan: 2,
        width: 130
      },
      {
        title: 'icn.icnContribution.calculate.model.totalSalaryContributions',
        colspan: 5,
        thClassList: ['text-center'],
        child: [
          {
            title: 'icn.icnContribution.calculate.model.contractSalary',
            field: 'contractSalary',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 140
          },
          {
            title: 'icn.icnContribution.calculate.model.reserveSalary',
            field: 'reserveSalary',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 200
          },
          {
            title: 'icn.icnContribution.calculate.model.posAllowanceSalary',
            field: 'posAllowanceSalary',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 170
          },
          {
            title: 'icn.icnContribution.calculate.model.senioritySalary',
            field: 'senioritySalary',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 200
          },
          {
            title: 'icn.icnContribution.calculate.model.posSenioritySalary',
            field: 'posSenioritySalary',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 180
          }
        ]
      },
      {
        title: 'icn.icnContribution.calculate.model.social',
        colspan: 2,
        thClassList: ['text-center'],
        child: [
          {
            title: 'icn.icnContribution.calculate.model.perSocialAmount',
            field: 'perSocialAmount',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 110
          },
          {
            title: 'icn.icnContribution.calculate.model.unitSocialAmount',
            field: 'unitSocialAmount',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 110
          }
        ]
      },
      {
        title: 'icn.icnContribution.calculate.model.medical',
        colspan: 2,
        thClassList: ['text-center'],
        child: [
          {
            title: 'icn.icnContribution.calculate.model.perMedicalAmount',
            field: 'perMedicalAmount',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 110
          },
          {
            title: 'icn.icnContribution.calculate.model.unitMedicalAmount',
            field: 'unitMedicalAmount',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 110
          }
        ]
      },
      {
        title: 'icn.icnContribution.calculate.model.unemp',
        colspan: 2,
        thClassList: ['text-center'],
        child: [
          {
            title: 'icn.icnContribution.calculate.model.perUnempAmount',
            field: 'perUnempAmount',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 110
          },
          {
            title: 'icn.icnContribution.calculate.model.unitUnempAmount',
            field: 'unitUnempAmount',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 110
          }
        ]
      },
      {
        title: 'icn.icnContribution.calculate.model.totalAmount',
        field: 'totalAmount',
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        tdClassList: ['text-right'],
        rowspan: 2,
        width: 130
      },
      {
        title: 'icn.icnContribution.calculate.model.insuranceAgency',
        field: 'insuranceAgency',
        rowspan: 2,
        width: 200
      },
      {
        title: 'icn.icnContribution.calculate.model.empTypeCode',
        field: 'empTypeName',
        rowspan: 2,
        width: 175
      },
      {
        title: 'icn.icnContribution.calculate.model.jobName',
        field: 'jobName',
        rowspan: 2,
        width: 200
      },
      {
        title: 'icn.icnContribution.calculate.model.labourType',
        field: 'labourType',
        rowspan: 2,
        width: 120
      },
      {
        title: 'icn.icnContribution.calculate.model.orgName',
        field: 'orgName',
        rowspan: 2,
        width: 200
      },
      {
        title: '',
        field: 'action',
        rowspan: 2,
        tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
        width: 50,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: window.innerWidth > 1024,
        fixedDir: 'right'
      }
    ];
  };

  protected readonly MICRO_SERVICE = MICRO_SERVICE;
}


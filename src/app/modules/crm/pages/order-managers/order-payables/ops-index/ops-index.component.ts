import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OrderPayablesModel } from '../../../../data-access/models/order-managers/order-payables.model';
import { OrderPayablesService } from '../../../../data-access/services/order-managers/order-payables.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { FormGroup, Validators } from '@angular/forms';
import { Constant } from '@app/modules/crm/data-access/constants/constants';
import { Utils } from '@core/utils/utils';
import { CATEGORY_CODE, REQUEST_TYPE } from '@shared/constant/common';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/crm/data-access/constants/url.class';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { CategoryModel } from '@core/models/category-common.interface';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ObjectUtil } from '@core/utils/object.util';
import { CategoriesService } from '@app/modules/kpi/data-access/other-services/categories.service';
import { OpsFormComponent } from '@app/modules/crm/pages/order-managers/order-payables/ops-form/ops-form.component';

@Component({
  selector: 'app-ops-index',
  templateUrl: './ops-index.component.html',
  styleUrls: ['./ops-index.component.scss']
})


export class OpsIndexComponent extends BaseListComponent<OrderPayablesModel> implements OnInit {
  isShowAdvSearch = false;
  functionCode = Constant.FUNCTION_CODE.CRM_ORDER_PAYABLE;
  isVisible = false;
  isVisibleMakeList = false;
  formModal: FormGroup;
  formModalMakeList: FormGroup;
  listStatus: CategoryModel[] = [];
  statusCodeList: NzSafeAny[] = [];
  categoryCode = CATEGORY_CODE;
  statusCodes = Constant.ORDER_PAYABLES;
  @ViewChild('statusTmpl', { static: true }) statusTmpl!: TemplateRef<NzSafeAny>;
  actionSchemaHeader: ActionSchema;
  visibleActionsCount = 0;

  constructor(
    injector: Injector,
    private readonly categoryService: CategoriesService,
    private readonly service: OrderPayablesService
  ) {
    super(injector);
    this.getDataSelect();
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.key = "orderPayableId";
    this.formConfig = {
      title: 'crm.orderPayables.label.title',
      content: OpsFormComponent
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null],
      statusId: [null],
      periodDate: [new Date(), [Validators.required]],
      startPeriodDate: [new Date(), [Validators.required]],
      endPeriodDate: [new Date(), [Validators.required]]
    });
    this.formModal = this.fb.group({
      note: [null],
      statusId: [this.statusCodes.PHE_DUYET, [Validators.required]],
      orderPayableId: [null, [Validators.required]]
    });
    this.formModalMakeList = this.fb.group({
      periodDate: [new Date(), [Validators.required]]
    });
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.detail',
          icon: 'eye',
          isShow: true,
          function: (evt: any) => {
            this.doOpenForm(this.modeConst.VIEW, evt);
          }
        }),        
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShowFn: (evt: any) => [this.statusCodes.CHO_PHE_DUYET, this.statusCodes.TU_CHOI].includes(evt.statusId) && this.objFunction?.edit,
          function: (evt: any) => {
            this.doOpenForm(this.modeConst.EDIT, evt);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShowFn: (evt: any) => [this.statusCodes.CHO_PHE_DUYET, this.statusCodes.TU_CHOI].includes(evt.statusId) && this.objFunction?.delete,
          function: this.deleteItem
        }),
        new ChildActionSchema({
          label: 'crm.customerCertificates.table.approve',
          icon: 'check',
          isShowFn: (evt: any) => [this.statusCodes.CHO_PHE_DUYET].includes(evt.statusId) && this.objFunction?.approve,
          function: (evt: any) => {
            this.openModal(evt.orderPayableId);
          }
        }),
        new ChildActionSchema({
          label: 'crm.customerCertificates.table.unapprove',
          icon: 'undo',
          isShowFn: (evt: any) => [this.statusCodes.PHE_DUYET].includes(evt.statusId) && this.objFunction?.approve,
          function: (evt: any) => {
            this.unapproveItem(evt.orderPayableId);
          }
        })
      ]
    });
    this.actionSchemaHeader = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.approveAll',
          icon: 'check',
          isShow: this.objFunction?.approve,
          function: () => {
            this.approveAll();
          }
        }),
        new ChildActionSchema({
          label: 'common.button.export',
          icon: 'export',
          isShow: true,
          function: () => {
            this.export();
          }
        })
      ]
    });
    this.visibleActionsCount = this.actionSchemaHeader.arrAction.filter(it => it.isShow && it.isShowFn).length;
  }

  getDataSelect() {
    this.listStatus = ObjectUtil.optionsToList(Constant.LIST_STATUS2, this.translate);
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{typeCode}', this.categoryCode.CRM_ORDER_PAYABLES_STATUS))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.statusCodeList = res.data.map((item: NzSafeAny) => {
            if ([this.statusCodes.CHO_PHE_DUYET].includes(item.code)) {
              item.color = '#F99600';
              item.bgColor = '#FFF2DA';
            } else if ([this.statusCodes.TU_CHOI].includes(item.code)) {
              item.color = '#FA0B0B';
              item.bgColor = '#FDE7EA';
            } else {
              item.color = '#06A561';
              item.bgColor = '#DAF9EC';
            }
            return item;
          });
        }
      });
  }

  approveAll() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const periodDate = Utils.convertDateToSendServer(this.form.controls.periodDate.value);
      this.service.createOrImport({ periodDate }, REQUEST_TYPE.DEFAULT, UrlConstant.ORDER_PAYABLES.APPROVE_ALL).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(
            this.translate.instant('common.notification.isApproveAll')
          );
          this.search();
        }
      });
    }
  }

  openModal(id: number) {
    this.formModal.controls['orderPayableId'].setValue(id);
    this.formModal.controls['note'].setValue(null);
    this.formModal.controls['statusId'].setValue(this.statusCodes.PHE_DUYET);
    this.isVisible = true;
    this.isSubmitted = false;
  }

  openModalMakeList() {
    this.formModalMakeList.controls['periodDate'].setValue(this.form.controls.endPeriodDate.value);
    this.isVisibleMakeList = true;
    this.isSubmitted = false;
  }
  cancelMakeList(): void {
    this.isVisibleMakeList = false;
  }
  


  makeList() {
    this.isSubmitted = true;
    if (this.formModalMakeList.valid) {
      const periodDate = Utils.convertDateToSendServer(this.formModalMakeList.controls.periodDate.value);
      this.service.createOrImport({ periodDate }, REQUEST_TYPE.DEFAULT, UrlConstant.ORDER_PAYABLES.MAKE_LIST).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(
            this.translate.instant('common.notification.syntheticSuccess')
          );
          this.search();
        }
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isSubmitted = true;
    if (this.formModal.valid) {
      this.updateStatus(this.formModal.controls['statusId'].value, this.formModal.controls['orderPayableId'].value, this.formModal.controls['note'].value);
      this.isSubmitted = false;
      this.isVisible = false;
    }
  }

  unapproveItem(id: NzSafeAny) {
    this.service.update({ id: id }, REQUEST_TYPE.DEFAULT, UrlConstant.ORDER_PAYABLES.UNDO_APPROVE).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
        this.handleCancel();
      }
    });
  }


  updateStatus(type: string, id: number, note: string) {
    this.service.createOrImport({
      statusId: type,
      approvedNote: note
    }, REQUEST_TYPE.DEFAULT, UrlConstant.ORDER_PAYABLES.STATUS + id).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
    });
  }


  override setHeaders() {
    this.tableConfig.key = 'orderPayableId';
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
        title: 'crm.orderPayables.table.periodDate',
        field: 'periodDate',
        width: 75,
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        thClassList: ['text-center']
      },
      {
        title: 'crm.orderPayables.table.receivedPhoneNumber',
        field: 'receivedPhoneNumber',
        width: 110,
        tdClassList: ['text-center'],
        fixedDir: 'left',
        fixed: true,
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.orderPayables.table.receivedName',
        field: 'receivedName',
        width: 200,
        fixedDir: 'left',
        fixed: true,
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.orderPayables.table.status',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.statusTmpl,
        width: 150,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.orderPayables.table.customerPhoneNumber',
        field: 'mobileNumber',
        width: 110,
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.orderPayables.table.customerName',
        field: 'fullName',
        width: 200,
        fixedDir: 'left',
        fixed: true,
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },      
      {
        title: 'crm.orderPayables.table.orderCode',
        field: 'orderNo',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.orderPayables.table.productName',
        field: 'productName',
        width: 200,
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.orderPayables.table.paymentDate',
        field: 'paymentDate',
        width: 100,
        thClassList: ['text-center']
      },
      {
        title: 'crm.orderPayables.table.orderAmount',
        field: 'orderAmount',
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        width: 110,
        tdClassList: ['text-right'],
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'crm.orderPayables.table.referralFee',
        field: 'referralFee',
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        width: 110,
        tdClassList: ['text-right'],
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'crm.orderPayables.table.careFee',
        field: 'careFee',
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        width: 110,
        tdClassList: ['text-right'],
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'crm.orderPayables.table.welfareFee',
        field: 'welfareFee',
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        width: 110,
        tdClassList: ['text-right'],
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'crm.orderPayables.table.createdBy',
        field: 'createdBy',
        width: 150,
        thClassList: ['text-center'],
        show: false
      },
      {
        title: 'crm.customerCertificates.table.createdTime',
        field: 'createdTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.customerCertificates.table.modifiedBy',
        field: 'modifiedBy',
        thClassList: ['text-center'],
        width: 150,
        show: false
      },
      {
        title: 'crm.customerCertificates.table.modifiedTime',
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


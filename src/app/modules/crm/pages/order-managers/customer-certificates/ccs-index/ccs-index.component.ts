import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomerCertificatesModel } from '../../../../data-access/models/order-managers/customer-certificates.model';
import {
  CustomerCertificatesService
} from '../../../../data-access/services/order-managers/customer-certificates.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Constant } from '@app/modules/crm/data-access/constants/constants';
import {
  CcsFormComponent
} from '@app/modules/crm/pages/order-managers/customer-certificates/ccs-form/ccs-form.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { CategoriesService } from '@app/modules/kpi/data-access/other-services/categories.service';
import { CATEGORY_CODE, REQUEST_TYPE } from '@shared/constant/common';
import { UrlConstant } from '@app/modules/crm/data-access/constants/url.class';
import { FormGroup, Validators } from '@angular/forms';
import { CategoryModel } from '@core/models/category-common.interface';
import { ObjectUtil } from '@core/utils/object.util';
import { Utils } from '@core/utils/utils';

@Component({
  selector: 'app-ccs-index',
  templateUrl: './ccs-index.component.html',
  styleUrls: ['./ccs-index.component.scss']
})


export class CcsIndexComponent extends BaseListComponent<CustomerCertificatesModel> implements OnInit {
  isShowAdvSearch = false;
  isVisible = false;
  functionCode = Constant.FUNCTION_CODE.CRM_CUSTOMER_CERTIFICATES;
  statusCodeList: NzSafeAny[] = [];
  categoryCode = CATEGORY_CODE;
  statusCodes = Constant.CUSTOMER_CERTIFICATES;
  formModal: FormGroup;
  listStatus: CategoryModel[] = [];
  @ViewChild('statusTmpl', { static: true }) statusTmpl!: TemplateRef<NzSafeAny>;

  constructor(
    injector: Injector,
    private readonly categoryService: CategoriesService,
    private readonly service: CustomerCertificatesService
  ) {
    super(injector);
    this.initFormSearch();
    this.getDataSelect();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.key = "customerCertificateId";
    this.formConfig = {
      title: 'crm.customerCertificates.label.title',
      content: CcsFormComponent
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
  }

  beforeSearch() {
    this.params.startDate = Utils.convertDateToSendServer(this.params.startDate);
    this.params.endDate = Utils.convertDateToSendServer(this.params.endDate);
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null],
      statusId: [null],
      certificateId: [null],
      startDate: [null],
      endDate: [null],
      mobileNumber: [null]
    });
    this.formModal = this.fb.group({
      note: [null],
      statusId: [this.statusCodes.PHE_DUYET, [Validators.required]],
      customerCertificateId: [null, [Validators.required]]
    });
  }

  getDataSelect() {
    this.listStatus = ObjectUtil.optionsToList(Constant.LIST_STATUS, this.translate);
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{typeCode}', this.categoryCode.CRM_STATUS_CERTIFICATE))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.statusCodeList = res.data.map((item: NzSafeAny) => {
            if ([this.statusCodes.DE_NGHI_XOA, this.statusCodes.CHO_PHE_DUYET].includes(item.code)) {
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

  openModal(id: number) {
    this.formModal.controls['customerCertificateId'].setValue(id);
    this.formModal.controls['note'].setValue(null);
    this.formModal.controls['statusId'].setValue(this.statusCodes.PHE_DUYET);
    this.isVisible = true;
    this.isSubmitted = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isSubmitted = true;
    if (this.formModal.valid) {
      this.updateStatus(this.formModal.controls['statusId'].value, this.formModal.controls['customerCertificateId'].value, this.formModal.controls['note'].value);
      this.isSubmitted = false;
      this.isVisible = false;
    }
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.detail',
          icon: 'eye',
          isShow: this.objFunction?.view,
          function: (evt: any) => {
            this.doOpenForm(this.modeConst.VIEW, evt);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShowFn: (evt: any) => [this.statusCodes.CHO_PHE_DUYET, this.statusCodes.DE_NGHI_XOA, this.statusCodes.TU_CHOI].includes(evt.statusId) && this.objFunction?.edit,
          function: (evt: any) => {
            this.doOpenForm(this.modeConst.EDIT, evt);
          }
        }),
        new ChildActionSchema({
          label: 'crm.customerCertificates.table.approve',
          icon: 'check',
          isShowFn: (evt: any) => [this.statusCodes.CHO_PHE_DUYET, this.statusCodes.DE_NGHI_XOA].includes(evt.statusId) && this.objFunction?.approve,
          function: (evt: any) => {
            this.openModal(evt.customerCertificateId);
          }
        }),
        new ChildActionSchema({
          label: 'crm.customerCertificates.table.unapprove',
          icon: 'undo',
          isShowFn: (evt: any) => [this.statusCodes.PHE_DUYET].includes(evt.statusId) && this.objFunction?.approve,
          function: (evt: any) => {
            this.updateStatus(this.statusCodes.CHO_PHE_DUYET, evt.customerCertificateId, null);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShowFn: (evt: any) => [this.statusCodes.CHO_PHE_DUYET,this.statusCodes.DE_NGHI_XOA].includes(evt.statusId) && this.objFunction?.delete,
          function: this.deleteItem
        }),
        new ChildActionSchema({
          label: 'common.button.requestDelete2',
          icon: 'delete',
          isShowFn: (evt: any) => [this.statusCodes.PHE_DUYET].includes(evt.statusId) && this.objFunction?.delete,
          function: (evt: any) => {
            this.updateStatus(this.statusCodes.DE_NGHI_XOA, evt.customerCertificateId, null);
          }
        })
      ]
    });
  }

  updateStatus(type: string, id: number, note: string) {
    this.service.createOrImport({
      statusId: type,
      approvedNote: note
    }, REQUEST_TYPE.DEFAULT, UrlConstant.CUSTOMER_CERTIFICATES.STATUS + id).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
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
        width: 70
      },
      {
        title: 'crm.customerCertificates.table.phoneNumber',
        field: 'mobileNumber',
        width: 150,
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.customerCertificates.table.customerName',
        field: 'fullName',
        width: 200,
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.customerCertificates.table.productName',
        field: 'productName',
        width: 200,
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.customerCertificates.table.certificateName',
        field: 'certificateName',
        width: 200,
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.customerCertificates.table.issuedDate',
        field: 'issuedDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.customerCertificates.table.status',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.statusTmpl,
        width: 150,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.customerCertificates.table.approvedBy',
        field: 'approvedBy',
        width: 150,
        thClassList: ['text-center']
      },
      {
        title: 'crm.customerCertificates.table.approvedDate',
        field: 'approvedDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.customerCertificates.table.createdBy',
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


import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { OrdersFormComponent } from '@app/modules/crm/pages/order-managers/orders/orders-form/orders-form.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { CardObjectsService } from '@app/modules/crm/data-access/services/cskh/card-objects.service';
import { CardObjectModel } from '@app/modules/crm/data-access/models/order-managers/card-object.model';
import { PrintFormComponent } from '../../../ui/print-form/print-form.component';
import { TABLE_CONFIG_DEFAULT } from '@shared/constant/common';

@Component({
  selector: 'app-cskh-index',
  templateUrl: './cskh-index.component.html',
  styleUrls: ['./cskh-index.component.scss']
})
export class CskhIndexComponent extends BaseListComponent<CardObjectModel> implements OnInit {
  @ViewChild('daysUntilBirthdayTmpl', { static: true }) daysUntilBirthday: TemplateRef<any>;
  isShow = false;

  constructor(
    injector: Injector,
    private readonly service: CardObjectsService
  ) {
    super(injector);
    this.initFormSearch();
    this.initAction();
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.serviceName = MICRO_SERVICE.CRM;
    this.key = 'orderId';
    this.formConfig = {
      title: 'crm.orders.title',
      content: OrdersFormComponent
    };
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null],
      objType: ['KHACH_HANG']
    });
  }

  override beforeSearch() {
    this.setHeaders();
  }

  override beforeRenderTable() {
    this.responseSearch.data.listData.forEach(el => {
      el.totalPayment = (el.totalAmount ?? 0) - (el.totalPayment ?? 0);
    });
  }

  override beforeExport() {
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'crm.employees.table.printAction',
          icon: 'printer',
          function: this.print
        })
      ]
    });
  }

  objChange($event) {
    this.isShow = $event === 'TN_KHACH_HANG';
    this.search();
  }

  override setHeaders() {
    this.tableConfig = {
      headers: [
        {
          title: 'STT',
          thClassList: ['text-center'],
          tdClassList: ['text-center'],
          fixed: true,
          fixedDir: 'left',
          width: 50
        },
        {
          title: 'crm.cskh.table.fullName',
          field: 'fullName',
          width: 175,
           thFilter: true,
        filterType: 'text'
        },
        {
          title: 'crm.cskh.table.mobileNumber',
          field: 'mobileNumber',
          width: 120,
           thFilter: true,
        filterType: 'text'
        },
        {
          title: 'crm.cskh.table.relationTypeName',
          field: 'relationTypeName',
          remove: !this.isShow,
          width: 100,
           thFilter: true,
        filterType: 'text'
        },
        {
          title: 'crm.cskh.table.parentName',
          field: 'parentName',
          remove: !this.isShow,
          width: 250,
           thFilter: true,
        filterType: 'text'
        },
        {
          title: 'crm.cskh.table.parentMobileNumber',
          field: 'parentMobileNumber',
          remove: !this.isShow,
          width: 120,
           thFilter: true,
        filterType: 'text'
        },
        {
          title: 'crm.cskh.table.dateOfBirth',
          field: 'dateOfBirth',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.cskh.table.daysUntilBirthday',
          field: 'daysUntilBirthday',
          fieldType: 'tdTemplate',
          fieldTypeValue: this.daysUntilBirthday,
          width: 120,
          tdClassList: ['text-right'],
           thFilter: true,
        filterType: 'number'
        },
        {
          title: 'crm.cskh.table.email',
          field: 'email',
          width: 250,
           thFilter: true,
        filterType: 'text'
        },
        {
          title: 'crm.cskh.table.productName',
          field: 'productName',
          width: 120,
           thFilter: true,
        filterType: 'text'
        },
        {
          title: 'crm.cskh.table.productPrice',
          field: 'productPrice',
          width: 120,
          fieldType: 'pipe',
          tdClassList: ['text-right'],
          fieldTypeValue: 'currency'
        },
        {
          title: 'crm.cskh.table.owedAmount',
          field: 'owedAmount',
          width: 120,
          fieldType: 'pipe',
          tdClassList: ['text-right'],
          fieldTypeValue: 'currency',
           thFilter: true,
        filterType: 'number'
        },
        {
          title: 'crm.cskh.table.objName',
          field: 'objName',
          width: 200
        },
        {
          title: 'crm.cskh.table.currentAddress',
          field: 'currentAddress',
          width: 400,
           thFilter: true,
        filterType: 'text'
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
      ],
      total: 0,
      needScroll: true,
      loading: false,
      size: 'small',
      pageSize: TABLE_CONFIG_DEFAULT.pageSize,
      pageIndex: 1,
      showFrontPagination: false
    };
  }

  private print = (data) => {
    this.doOpenPrint(data);
  };

  doOpenPrint(data?: any) {
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth() + (this.addWidth ? this.addWidth : 0),
      nzTitle: this.translate.instant('crm.cskh.print'),
      nzContent: PrintFormComponent,
      nzComponentParams: {
        data: { objType: data?.objType ?? this.form.controls['objType'].value, objId: data?.objId }
      },
      nzFooter: null
    });
    this.modalRef.afterClose.subscribe((result) => {
        if (result?.refresh) {
          this.search(this.pagination.pageNumber);
        }
      }
    );
  }
}


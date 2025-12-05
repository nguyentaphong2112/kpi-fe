import { Component, Injector, OnInit } from '@angular/core';
import { OrdersModel } from '../../../../data-access/models/order-managers/orders.model';
import { OrdersService } from '../../../../data-access/services/order-managers/orders.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { OrdersFormComponent } from '../orders-form/orders-form.component';
import { Mode } from '@shared/constant/common';

@Component({
  selector: 'app-orders-index',
  templateUrl: './orders-index.component.html',
  styleUrls: ['./orders-index.component.scss']
})
export class OrdersIndexComponent extends BaseListComponent<OrdersModel> implements OnInit {
  isShowAdvSearch = false;
  serviceName = MICRO_SERVICE.CRM;
  constructor(
    injector: Injector,
    private readonly service: OrdersService
  ) {
    super(injector);
    this.initFormSearch();
    this.initAction();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.serviceName = MICRO_SERVICE.CRM;
    this.key = 'orderId';
    this.addWidth = 200;
    this.formConfig = {
      title: 'crm.orders.title',
      content: OrdersFormComponent
    };
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null],
      saleStaffId: [null],
      customerId: [null],
    });
  }

  override beforeSearch() {
  }

  override beforeRenderTable() {
    this.responseSearch.data.listData.forEach(el => {
      el.remainingAmount = el.finalAmount - el.collectedAmount;
    });
  }

  override beforeExport() {
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.view',
          icon: 'eye',
          function: this.doOpenFormDetail
        }),
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          function: this.deleteItem
        })
      ]
    });
  }

  onClickItem(data: any) {
    this.doOpenForm(Mode.EDIT, data);
  }


  override setHeaders() {
    this.tableConfig.key = this.key;
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
        title: 'crm.orders.table.fullName',
        field: 'fullName',
        width: 145,
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.orders.table.mobileNumber',
        field: 'mobileNumber',
        width: 90,
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.orders.table.orderNo',
        field: 'orderNo',
        width: 90,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.orders.table.orderDate',
        field: 'orderDate',
        width: 100,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.orders.table.finalAmount',
        field: 'finalAmount',
        width: 90,
        tdClassList: ['text-right'],
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'crm.orders.table.collectedAmount',
        field: 'collectedAmount',
        width: 90,
        tdClassList: ['text-right'],
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'crm.orders.table.referralFee',
        field: 'referralFee',
        width: 90,
        tdClassList: ['text-right'],
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'crm.orders.table.careFee',
        field: 'careFee',
        width: 90,
        tdClassList: ['text-right'],
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'crm.orders.table.welfareFee',
        field: 'welfareFee',
        width: 90,
        tdClassList: ['text-right'],
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'crm.orders.table.remainingAmount',
        field: 'remainingAmount',
        width: 90,
        tdClassList: ['text-right'],
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        thFilter: true,
        filterType: 'number'
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
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit,
      }
    ];
  }
}


import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseListComponent} from '@core/components/base-list.component';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {MiaFormComponent} from "@app/modules/mat/pages/inventory/mat-inventory-adjustments/mia-form/mia-form.component";

@Component({
  selector: 'app-inventory-adjustment-list',
  templateUrl: './inventory-adjustment-list.component.html',
  styleUrls: ['./inventory-adjustment-list.component.scss']
})


export class InventoryAdjustmentListComponent extends BaseListComponent<any> implements OnInit {
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  @ViewChild('attachFileTmpl', {static: true}) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
  ) {
    super(injector);
    this.isCustomSearch = true;
    this.key = 'inventoryAdjustmentId';
    this.addWidth = 300;
    this.formConfig = {
      title: ' ',
      content: MiaFormComponent,
    };
  }

  override beforeSearch() {
  }

  override beforeRenderTable() {
    this.responseSearch.data.listData.forEach(el => {
      // el.list = this.list;
    });
  }

  override beforeExport() {
  }


  override setHeaders() {
    this.tableConfig.showFrontPagination = false;
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
        title: 'mat.matWarehouses.inventoryAdjustment.inventoryAdjustmentNo',
        field: 'inventoryAdjustmentNo',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.inventoryAdjustment.shipmentName',
        field: 'inventoryAdjustmentNo',
        width: 120,
      },
      {
        title: 'mat.matWarehouses.inventoryAdjustment.typeName',
        field: 'typeName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.inventoryAdjustment.statusName',
        field: 'statusName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.inventoryAdjustment.startDate',
        field: 'startDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.inventoryAdjustment.endDate',
        field: 'endDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.inventoryAdjustment.note',
        field: 'note',
        width: 120,
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


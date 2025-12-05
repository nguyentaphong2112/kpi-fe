import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseListComponent} from '@core/components/base-list.component';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {MosFormComponent} from "@app/modules/mat/pages/inventory/mat-outgoing-shipments/mos-form/mos-form.component";

@Component({
  selector: 'app-outgoing-shipment-list',
  templateUrl: './outgoing-shipment-list.component.html',
  styleUrls: ['./outgoing-shipment-list.component.scss']
})


export class OutgoingShipmentListComponent extends BaseListComponent<any> implements OnInit {
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  @ViewChild('attachFileTmpl', {static: true}) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
  ) {
    super(injector);
    this.isCustomSearch = true;
    this.key = 'outgoingShipmentId';
    this.addWidth = 300;
    this.formConfig = {
      title: ' ',
      content: MosFormComponent,
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
        title: 'mat.matWarehouses.outgoingShipment.outgoingDate',
        field: 'outgoingDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.outgoingShipment.pickingNo',
        field: 'pickingNo',
        width: 120,
      },
      {
        title: 'mat.matWarehouses.outgoingShipment.statusName',
        field: 'statusName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.outgoingShipment.pickingEmployeeName',
        field: 'pickingEmployeeName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.outgoingShipment.typeName',
        field: 'typeName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.outgoingShipment.approvedTime',
        field: 'approvedTime',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.outgoingShipment.approvedName',
        field: 'approvedName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
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


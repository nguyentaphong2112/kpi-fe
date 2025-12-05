import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseListComponent} from '@core/components/base-list.component';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {MisFormComponent} from "@app/modules/mat/pages/inventory/mat-incoming-shipments/mis-form/mis-form.component";

@Component({
  selector: 'app-incoming-shipment-list',
  templateUrl: './incoming-shipment-list.component.html',
  styleUrls: ['./incoming-shipment-list.component.scss']
})


export class IncomingShipmentListComponent extends BaseListComponent<any> implements OnInit {
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  @ViewChild('attachFileTmpl', {static: true}) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
  ) {
    super(injector);
    this.isCustomSearch = true;
    this.key = 'incomingShipmentId';
    this.formConfig = {
      title: ' ',
      content: MisFormComponent,
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
        title: 'mat.matWarehouses.incomingShipment.incomingDate',
        field: 'incomingDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.incomingShipment.pickingNo',
        field: 'pickingNo',
        width: 120,
      },
      {
        title: 'mat.matWarehouses.incomingShipment.statusName',
        field: 'statusName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.incomingShipment.pickingEmployeeName',
        field: 'pickingEmployeeName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.incomingShipment.typeName',
        field: 'typeName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.incomingShipment.approvedTime',
        field: 'approvedTime',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.incomingShipment.approvedName',
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


import {Component, EventEmitter, Injector, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {BaseListComponent} from '@core/components/base-list.component';
import {HbtTableComponent} from '@shared/component/hbt-table/hbt-table.component';

@Component({
  selector: 'app-mis-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss']
})


export class EquipmentListComponent extends BaseListComponent<any> implements OnInit {

  @ViewChild('quantityTmpl', {static: true}) quantity!: TemplateRef<any>;
  @ViewChild('unitPriceTmpl', {static: true}) unitPrice!: TemplateRef<any>;
  @ViewChild('amountTmpl', {static: true}) amount!: TemplateRef<any>;
  @ViewChild(HbtTableComponent) hbtTable!: HbtTableComponent;

  @Input() isDisabled = false;
  @Output() listEquipmentIdsChange = new EventEmitter<number[]>();

  constructor(
    injector: Injector,
  ) {
    super(injector);
    this.isCustomSearch = true;
    this.key = 'equipmentId';
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
        title: 'mat.matIncomingShipments.listEquipments.table.equipmentType',
        field: 'equipmentTypeName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matIncomingShipments.listEquipments.table.name',
        field: 'name',
        width: 120,
      },
      {
        title: 'mat.matIncomingShipments.listEquipments.table.code',
        field: 'code',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matIncomingShipments.listEquipments.table.equipmentUnit',
        field: 'equipmentUnitName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matIncomingShipments.listEquipments.table.quantity',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.quantity,
        width: 120,
        tdClassList: ['text-right'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matIncomingShipments.listEquipments.table.unitPrice',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.unitPrice,
        width: 120,
        tdClassList: ['text-right'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matIncomingShipments.listEquipments.table.amount',
        field: 'amount',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.amount,
        tdClassList: ['text-right'],
        thClassList: ['text-center'],
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
        show: !this.isDisabled,
      }
    ];
  }

  override processDeleteData(id: number) {
    this.tableData = this.tableData.filter(el => el[this.key] !== id);
    if (this.tableData.length > 0) {
      this.listEquipmentIdsChange.emit(this.tableData.map(el => el[this.key]));
    } else {
      this.listEquipmentIdsChange.emit(null);
    }
  }

}


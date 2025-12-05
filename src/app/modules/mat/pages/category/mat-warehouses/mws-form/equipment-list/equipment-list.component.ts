import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseListComponent} from '@core/components/base-list.component';
import {HTTP_STATUS_CODE, MICRO_SERVICE} from '@core/constant/system.constants';
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {Mode, REQUEST_TYPE} from "@shared/constant/common";
import {
  MatWarehousesEquipmentsService
} from "@app/modules/mat/data-access/services/category/mat-warehouses-equipments.service";

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss']
})


export class EquipmentListComponent extends BaseListComponent<any> implements OnInit {
  @ViewChild('unitPriceTmpl', {static: true}) unitPrice!: TemplateRef<any>;
  @ViewChild('amountTmpl', {static: true}) amount!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private service: MatWarehousesEquipmentsService
  ) {
    super(injector);
    this.isCustomSearch = true;
    this.key = 'warehouseEquipmentId';
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
        title: 'mat.matWarehouses.equipment.code',
        field: 'code',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.equipment.name',
        field: 'name',
        width: 120,
      },
      {
        title: 'mat.matWarehouses.equipment.equipmentType',
        field: 'equipmentTypeName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.equipment.equipmentUnit',
        field: 'equipmentUnitName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.equipment.quantity',
        field: 'quantity',
        width: 120,
        tdClassList: ['text-right'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.equipment.unitPrice',
        field: 'unitPrice',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.unitPrice,
        width: 120,
        tdClassList: ['text-right'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.equipment.amount',
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
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit,
      }
    ];
  }

  updateUnitPrice(data: any, content: any) {
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth() + (this.addWidth ? this.addWidth : 0),
      nzTitle: this.getModeTitle(this.modeConst.EDIT),
      nzContent: content,
      nzComponentParams: {
        data: JSON.parse(JSON.stringify(data))
      },
      nzFooter: this.footerTpl
    });
    this.modalRef.afterClose.subscribe((result) => {
        data.unitPrice = result.unitPrice;
      }
    );
  }

  saveUnitPrice(data: any) {
    data.id = data[this.key];
    this.service.update(data, REQUEST_TYPE.DEFAULT).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.success'));
        this.modalRef.close(data);
      } else {
        this.toast.error(res.message);
      }
    }, error => {
      this.toast.error(error.message);
    });
  }
}


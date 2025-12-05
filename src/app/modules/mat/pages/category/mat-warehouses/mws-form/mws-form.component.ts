import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Validators} from '@angular/forms';
import {MatWarehousesModel} from '../../../../data-access/models/category/mat-warehouses.model';
import {MatWarehousesService} from '../../../../data-access/services/category/mat-warehouses.service';
import {BaseFormComponent} from '@core/components/base-form.component';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from '@shared/constant/common';
import {NzSafeAny} from 'ng-zorro-antd/core/types';
import {ScrollSpyDirective} from '@shared/directive/scroll-spy.directive';
import {MbCollapseComponent} from '@shared/component/hbt-collapse/hbt-collapse.component';
import {
  EmployeeListComponent
} from '@app/modules/mat/pages/category/mat-warehouses/mws-form/employee-list/employee-list.component';
import {
  EquipmentListComponent
} from '@app/modules/mat/pages/category/mat-warehouses/mws-form/equipment-list/equipment-list.component';
import {
  IncomingShipmentListComponent
} from '@app/modules/mat/pages/category/mat-warehouses/mws-form/incoming-shipment-list/incoming-shipment-list.component';
import {
  InventoryAdjustmentListComponent
} from '@app/modules/mat/pages/category/mat-warehouses/mws-form/inventory-adjustment-list/inventory-adjustment-list.component';
import {
  OutgoingShipmentListComponent
} from '@app/modules/mat/pages/category/mat-warehouses/mws-form/outgoing-shipment-list/outgoing-shipment-list.component';
import {Scopes} from "@core/utils/common-constants";
import {Constant} from "@app/modules/mat/data-access/constants/constants";

@Component({
  selector: 'mws-form',
  templateUrl: './mws-form.component.html',
  styleUrls: ['./mws-form.component.scss']
})
export class MwsFormComponent extends BaseFormComponent<MatWarehousesModel> implements OnInit, AfterViewInit {

  @ViewChild(EmployeeListComponent) employeeList: EmployeeListComponent;

  constructor(
    private readonly service: MatWarehousesService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'warehouseId';
    this.isConvertFindForm = false;

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: MatWarehousesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: MatWarehousesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  serviceName = MICRO_SERVICE.MAT;
  urlLoadData = '/mat-warehouses';

  public panels: NzSafeAny[] = [];
  public scrollTabs: NzSafeAny = [];

  @ViewChild(ScrollSpyDirective) scrollSpy: ScrollSpyDirective;
  @ViewChild('collapse') collapse!: MbCollapseComponent;
  functionCode = Constant.FUNCTION_CODE.MAT_WAREHOUSES;
  scope = Scopes.EDIT;

  override initForm() {
    this.form = this.fb.group({
      warehouseId: [null],
      code: [null, [Validators.required, Validators.maxLength(50)]],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      parentId: [null],
      address: [null, [Validators.required, Validators.maxLength(500)]],
      type: [null, [Validators.required]],
      departmentId: [null, [Validators.required]],
      statusId: [null, [Validators.required]],
      note: [null],
      employeeIds: [null, [Validators.required]],
      });
  }

  ngAfterViewInit() {
    if (this.mode === this.modeConst.VIEW) {
      this.getPanels();
    }
  }

  getPanels() {
    const panels: any[] = [{
        id: 'employeeList',
        active: true,
        disabled: false,
        icon: null,
        name: '',
        panelComponent: EmployeeListComponent
      },
      {
        id: 'equipmentList',
        active: true,
        disabled: false,
        icon: null,
        name: 'mat.matWarehouses.equipmentList',
        panelComponent: EquipmentListComponent
      },
      {
        id: 'incomingShipmentList',
        active: true,
        disabled: false,
        icon: null,
        name: 'mat.matWarehouses.incomingShipmentList',
        panelComponent: IncomingShipmentListComponent
      },
      {
        id: 'outgoingShipmentList',
        active: true,
        disabled: false,
        icon: null,
        name: 'mat.matWarehouses.outgoingShipmentList',
        panelComponent: OutgoingShipmentListComponent
      },
      {
        id: 'inventoryAdjustmentList',
        active: true,
        disabled: false,
        icon: null,
        name: 'mat.matWarehouses.inventoryAdjustmentList',
        panelComponent: InventoryAdjustmentListComponent
      }];
    this.scrollTabs = panels.map(el => ({
        title: el.name ? el.name : 'mat.matWarehouses.employeeList',
        scrollTo: el.id
    }));
    this.collapse.setPanels(panels);
    setTimeout(() => {
      this.panels = panels;
      this.panels.forEach(panel => {
        this.collapse.setReference(panel.componentRef, panel.id);
      });
      this.scrollSpy.collectIds();
      this.scrollSpy.setLink(0);
      this.ref.detectChanges();
    });
  }

  beforePatchValue() {
    super.beforePatchValue();
    if (this.mode === this.modeConst.VIEW) {
      for (const panel of this.panels) {
        if (panel.id === 'employeeList') {
          panel.componentRef.instance.tableData = this.data.listEmployee;
        }
        if (panel.id === 'equipmentList') {
          panel.componentRef.instance.tableData = this.data.listEquipment;
        }
        if (panel.id === 'incomingShipmentList') {
          panel.componentRef.instance.tableData = this.data.listIncomingShipment;
        }
        if (panel.id === 'inventoryAdjustmentList') {
          panel.componentRef.instance.tableData = this.data.listInventoryAdjustment;
        }
        if (panel.id === 'outgoingShipmentList') {
          panel.componentRef.instance.tableData = this.data.listOutgoingShipment;
        }
      }
    } else {
      this.data.employeeIds = this.data.listEmployee.map(el => el.employeeId);
      this.employeeList.tableData = this.data.listEmployee.map(el => ({...el, isManager: el.isManager === 'Y'}));
    }
  }

  changeEmp(emps: any) {
    const listItemSelected = JSON.parse(JSON.stringify(emps.listItemSelected));
    const empList = this.employeeList.tableData.filter(el => emps.listOfSelected.includes(el.employeeId));
    const empChange = listItemSelected.filter(el => !empList.map(e => e.employeeId).includes(el.employeeId));
    const empResult = [...empList, ...empChange];
    if (empResult.length > 0 && !empResult.some(el => el.isManager)) {
      empResult[0].isManager = true;
    }
    this.employeeList.tableData = empResult;
  }

  override beforeSave() {
    super.beforeSave();
    if (!this.body.parentId && this.body.type !== "KHO_TONG") {
      this.body.type = "KHO_TONG";
    } else if (this.body.type === "KHO_TONG") {
      this.body.parentId = null;
    }
    this.body.listEmployee = this.employeeList.tableData;
  }

  listEmpIdsChange(employeeIds: number[]) {
    this.form.controls['employeeIds'].setValue(employeeIds);
  }

  changeType(value: any) {
    if (value === "KHO_TONG") {
      this.form.controls['parentId'].setValue(null);
    }
  }
}



import { NgModule } from '@angular/core';
import {SharedModule} from '@shared/shared.module';
import {MwsIndexComponent} from '@app/modules/mat/pages/category/mat-warehouses/mws-index/mws-index.component';
import {MwsFormComponent} from '@app/modules/mat/pages/category/mat-warehouses/mws-form/mws-form.component';
import {MatWarehousesRoutingModule} from '@app/modules/mat/pages/category/mat-warehouses/mat-warehouses.routing.module';
import {
  OutgoingShipmentListComponent
} from '@app/modules/mat/pages/category/mat-warehouses/mws-form/outgoing-shipment-list/outgoing-shipment-list.component';
import {
  InventoryAdjustmentListComponent
} from '@app/modules/mat/pages/category/mat-warehouses/mws-form/inventory-adjustment-list/inventory-adjustment-list.component';
import {
  IncomingShipmentListComponent
} from '@app/modules/mat/pages/category/mat-warehouses/mws-form/incoming-shipment-list/incoming-shipment-list.component';
import {
  EquipmentListComponent
} from '@app/modules/mat/pages/category/mat-warehouses/mws-form/equipment-list/equipment-list.component';
import {
  EmployeeListComponent
} from '@app/modules/mat/pages/category/mat-warehouses/mws-form/employee-list/employee-list.component';
import {
  MatIncomingShipmentsModule
} from "@app/modules/mat/pages/inventory/mat-incoming-shipments/mat-incoming-shipments.module";

export function declaration() {
  return [MwsIndexComponent, MwsFormComponent, OutgoingShipmentListComponent, InventoryAdjustmentListComponent,
    IncomingShipmentListComponent, EquipmentListComponent, EmployeeListComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, MatWarehousesRoutingModule, MatIncomingShipmentsModule]
})
export class MatWarehousesModule { }


import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {MtsIndexComponent} from "@app/modules/mat/pages/inventory/mat-transferring-shipments/mts-index/mts-index.component";
import {MtsFormComponent} from "@app/modules/mat/pages/inventory/mat-transferring-shipments/mts-form/mts-form.component";
import {MatTransferringShipmentsRoutingModule} from "@app/modules/mat/pages/inventory/mat-transferring-shipments/mat-transferring-shipments.routing.module";
import {
  EquipmentListComponent
} from "@app/modules/mat/pages/inventory/mat-transferring-shipments/mts-form/equipment-list/equipment-list.component";
import {
    MatOutgoingShipmentsModule
} from "@app/modules/mat/pages/inventory/mat-outgoing-shipments/mat-outgoing-shipments.module";

export function declaration() {
  return [MtsIndexComponent, MtsFormComponent, EquipmentListComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
    imports: [SharedModule, MatTransferringShipmentsRoutingModule, MatOutgoingShipmentsModule]
})
export class MatTransferringShipmentsModule { }


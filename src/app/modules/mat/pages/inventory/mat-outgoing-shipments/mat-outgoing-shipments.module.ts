import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {MosIndexComponent} from "@app/modules/mat/pages/inventory/mat-outgoing-shipments/mos-index/mos-index.component";
import {MosFormComponent} from "@app/modules/mat/pages/inventory/mat-outgoing-shipments/mos-form/mos-form.component";
import {MatOutgoingShipmentsRoutingModule} from "@app/modules/mat/pages/inventory/mat-outgoing-shipments/mat-outgoing-shipments.routing.module";
import {
  EquipmentListComponent
} from "@app/modules/mat/pages/inventory/mat-outgoing-shipments/mos-form/equipment-list/equipment-list.component";
import {
  MatIncomingShipmentsModule
} from "@app/modules/mat/pages/inventory/mat-incoming-shipments/mat-incoming-shipments.module";

export function declaration() {
  return [MosIndexComponent, MosFormComponent, EquipmentListComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, MatOutgoingShipmentsRoutingModule, MatIncomingShipmentsModule]
})
export class MatOutgoingShipmentsModule { }


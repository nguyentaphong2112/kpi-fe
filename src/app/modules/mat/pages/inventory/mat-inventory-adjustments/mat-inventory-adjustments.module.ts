import { NgModule } from '@angular/core';
import {SharedModule} from '@shared/shared.module';
import {MiaIndexComponent} from '@app/modules/mat/pages/inventory/mat-inventory-adjustments/mia-index/mia-index.component';
import {MiaFormComponent} from '@app/modules/mat/pages/inventory/mat-inventory-adjustments/mia-form/mia-form.component';
import {MatInventoryAdjustmentsRoutingModule} from '@app/modules/mat/pages/inventory/mat-inventory-adjustments/mat-inventory-adjustments.routing.module';
import {
  EquipmentListComponent
} from '@app/modules/mat/pages/inventory/mat-inventory-adjustments/mia-form/equipment-list/equipment-list.component';
import {
  MatIncomingShipmentsModule
} from "@app/modules/mat/pages/inventory/mat-incoming-shipments/mat-incoming-shipments.module";

export function declaration() {
  return [MiaIndexComponent, MiaFormComponent, EquipmentListComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, MatInventoryAdjustmentsRoutingModule, MatIncomingShipmentsModule]
})
export class MatInventoryAdjustmentsModule { }


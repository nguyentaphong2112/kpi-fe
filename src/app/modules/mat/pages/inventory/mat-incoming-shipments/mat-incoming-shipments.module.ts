import { NgModule } from '@angular/core';
import {SharedModule} from '@shared/shared.module';
import {MisIndexComponent} from '@app/modules/mat/pages/inventory/mat-incoming-shipments/mis-index/mis-index.component';
import {MisFormComponent} from '@app/modules/mat/pages/inventory/mat-incoming-shipments/mis-form/mis-form.component';
import {MatIncomingShipmentsRoutingModule} from '@app/modules/mat/pages/inventory/mat-incoming-shipments/mat-incoming-shipments.routing.module';
import {
  EquipmentListComponent
} from '@app/modules/mat/pages/inventory/mat-incoming-shipments/mis-form/equipment-list/equipment-list.component';

export function declaration() {
  return [MisIndexComponent, MisFormComponent, EquipmentListComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, MatIncomingShipmentsRoutingModule]
})
export class MatIncomingShipmentsModule { }


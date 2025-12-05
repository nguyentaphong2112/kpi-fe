import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {ShipmentsIndexComponent} from "@app/modules/crm/pages/order-managers/shipments/shipments-index/shipments-index.component";
import {ShipmentsFormComponent} from "@app/modules/crm/pages/order-managers/shipments/shipments-form/shipments-form.component";
import {ShipmentsRoutingModule} from "@app/modules/crm/pages/order-managers/shipments/shipments.routing.module";

export function declaration() {
  return [ShipmentsIndexComponent, ShipmentsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, ShipmentsRoutingModule]
})
export class ShipmentsModule { }


import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {OpsIndexComponent} from "@app/modules/crm/pages/order-managers/order-payables/ops-index/ops-index.component";
import {OpsFormComponent} from "@app/modules/crm/pages/order-managers/order-payables/ops-form/ops-form.component";
import {OrderPayablesRoutingModule} from "@app/modules/crm/pages/order-managers/order-payables/order-payables.routing.module";

export function declaration() {
  return [OpsIndexComponent, OpsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, OrderPayablesRoutingModule]
})
export class OrderPayablesModule { }


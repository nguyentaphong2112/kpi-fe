import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {CustomersIndexComponent} from "@app/modules/crm/pages/order-managers/customers/customers-index/customers-index.component";
import {CustomersFormComponent} from "@app/modules/crm/pages/order-managers/customers/customers-form/customers-form.component";
import {CustomersRoutingModule} from "@app/modules/crm/pages/order-managers/customers/customers.routing.module";
import {CareFormComponent} from "@app/modules/crm/pages/order-managers/customers/care-form/care-form.component";

export function declaration() {
  return [CustomersIndexComponent, CustomersFormComponent, CareFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, CustomersRoutingModule]
})
export class CustomersModule { }


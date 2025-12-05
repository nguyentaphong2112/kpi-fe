import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { OrdersIndexComponent } from '@app/modules/crm/pages/order-managers/orders/orders-index/orders-index.component';
import { OrdersFormComponent } from '@app/modules/crm/pages/order-managers/orders/orders-form/orders-form.component';
import { OrdersRoutingModule } from '@app/modules/crm/pages/order-managers/orders/orders.routing.module';
import { PaymentsFormComponent } from '@app/modules/crm/pages/order-managers/orders/payments-form/payments-form.component';

export function declaration() {
  return [OrdersIndexComponent, OrdersFormComponent, PaymentsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, OrdersRoutingModule]
})
export class OrdersModule {
}


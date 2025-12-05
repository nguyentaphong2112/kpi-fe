import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'orders',
    loadChildren: () => import('../order-managers/orders/orders.module').then(m => m.OrdersModule)
  },
  {
    path: 'customers',
    loadChildren: () => import('../order-managers/customers/customers.module').then(m => m.CustomersModule)
  },
  {
    path: 'customer-care-records',
    loadChildren: () => import('../order-managers/customer-care-records/customer-care-records.module').then(m => m.CustomerCareRecordsModule)
  },
  {
    path: 'customer-certificates',
    loadChildren: () => import('../order-managers/customer-certificates/customer-certificates.module').then(m => m.CustomerCertificatesModule)
  },
  {
    path: 'order-payables',
    loadChildren: () => import('../order-managers/order-payables/order-payables.module').then(m => m.OrderPayablesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderManagersRoutingModule {
}

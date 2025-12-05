import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrdersIndexComponent } from '@app/modules/crm/pages/order-managers/orders/orders-index/orders-index.component';
import { OrdersFormComponent } from '@app/modules/crm/pages/order-managers/orders/orders-form/orders-form.component';


const routes: Routes = [
  {
    path: '',
    component: OrdersIndexComponent
  },
  {
    path: 'form',
    component: OrdersFormComponent,
    data: {
      isShowBackBtn: true,
      pageName: 'Thêm mới',
      breadcrumb: 'Thêm mới'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule {
}


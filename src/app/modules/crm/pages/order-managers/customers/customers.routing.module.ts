import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CustomersIndexComponent } from '@app/modules/crm/pages/order-managers/customers/customers-index/customers-index.component';
import { CustomersFormComponent } from '@app/modules/crm/pages/order-managers/customers/customers-form/customers-form.component';


const routes: Routes = [
  {
    path: '',
    component: CustomersIndexComponent
  },
  {
    path: 'form',
    component: CustomersFormComponent,
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
export class CustomersRoutingModule {
}


import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { OpsIndexComponent } from '@app/modules/crm/pages/order-managers/order-payables/ops-index/ops-index.component';
import { OpsFormComponent } from '@app/modules/crm/pages/order-managers/order-payables/ops-form/ops-form.component';


const routes: Routes = [
  {
    path: '',
    component: OpsIndexComponent
  },
  {
    path: 'form',
    component: OpsFormComponent,
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
export class OrderPayablesRoutingModule {
}


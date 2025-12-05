import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ShipmentsIndexComponent } from '@app/modules/crm/pages/order-managers/shipments/shipments-index/shipments-index.component';
import { ShipmentsFormComponent } from '@app/modules/crm/pages/order-managers/shipments/shipments-form/shipments-form.component';


const routes: Routes = [
  {
    path: '',
    component: ShipmentsIndexComponent
  },
  {
    path: 'form',
    component: ShipmentsFormComponent,
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
export class ShipmentsRoutingModule {
}


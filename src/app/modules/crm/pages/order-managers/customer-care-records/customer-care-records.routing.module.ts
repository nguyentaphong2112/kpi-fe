import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CcrIndexComponent } from '@app/modules/crm/pages/order-managers/customer-care-records/ccr-index/ccr-index.component';
import { CcrFormComponent } from '@app/modules/crm/pages/order-managers/customer-care-records/ccr-form/ccr-form.component';


const routes: Routes = [
  {
    path: '',
    component: CcrIndexComponent
  },
  {
    path: 'form',
    component: CcrFormComponent,
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
export class CustomerCareRecordsRoutingModule {
}


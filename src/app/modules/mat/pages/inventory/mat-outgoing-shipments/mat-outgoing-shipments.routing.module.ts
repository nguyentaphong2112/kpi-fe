import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MosIndexComponent } from '@app/modules/mat/pages/inventory/mat-outgoing-shipments/mos-index/mos-index.component';
import { MosFormComponent } from '@app/modules/mat/pages/inventory/mat-outgoing-shipments/mos-form/mos-form.component';


const routes: Routes = [
  {
    path: '',
    component: MosIndexComponent
  },
  {
    path: 'form',
    component: MosFormComponent,
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
export class MatOutgoingShipmentsRoutingModule {
}


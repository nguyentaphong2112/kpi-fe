import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RtsIndexComponent } from '@app/modules/abs/pages/category-manager/reason-types/rts-index/rts-index.component';
import { RtsFormComponent } from '@app/modules/abs/pages/category-manager/reason-types/rts-form/rts-form.component';


const routes: Routes = [
  {
    path: '',
    component: RtsIndexComponent
  },
  {
    path: 'form',
    component: RtsFormComponent,
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
export class ReasonTypesRoutingModule {
}


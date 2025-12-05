import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AlsIndexComponent } from '@app/modules/abs/pages/category-manager/annual-leaves/als-index/als-index.component';
import { AlsFormComponent } from '@app/modules/abs/pages/category-manager/annual-leaves/als-form/als-form.component';


const routes: Routes = [
  {
    path: '',
    component: AlsIndexComponent
  },
  {
    path: 'form',
    component: AlsFormComponent,
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
export class AnnualLeavesRoutingModule {
}


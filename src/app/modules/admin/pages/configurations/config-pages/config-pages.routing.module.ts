import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CpsIndexComponent } from '@app/modules/admin/pages/configurations/config-pages/cps-index/cps-index.component';
import { CpsFormComponent } from '@app/modules/admin/pages/configurations/config-pages/cps-form/cps-form.component';


const routes: Routes = [
  {
    path: '',
    component: CpsIndexComponent
  },
  {
    path: 'form',
    component: CpsFormComponent,
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
export class ConfigPagesRoutingModule {
}


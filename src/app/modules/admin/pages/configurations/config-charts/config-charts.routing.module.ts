import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CcsIndexComponent } from '@app/modules/admin/pages/configurations/config-charts/ccs-index/ccs-index.component';
import { CcsFormComponent } from '@app/modules/admin/pages/configurations/config-charts/ccs-form/ccs-form.component';


const routes: Routes = [
  {
    path: '',
    component: CcsIndexComponent
  },
  {
    path: 'form',
    component: CcsFormComponent,
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
export class ConfigChartsRoutingModule {
}


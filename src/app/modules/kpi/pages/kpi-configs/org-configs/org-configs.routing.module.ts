import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { OcsIndexComponent } from '@app/modules/kpi/pages/kpi-configs/org-configs/ocs-index/ocs-index.component';
import { OcsFormComponent } from '@app/modules/kpi/pages/kpi-configs/org-configs/ocs-form/ocs-form.component';


const routes: Routes = [
  {
    path: '',
    component: OcsIndexComponent
  },
  {
    path: 'form',
    component: OcsFormComponent,
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
export class OrgConfigsRoutingModule {
}


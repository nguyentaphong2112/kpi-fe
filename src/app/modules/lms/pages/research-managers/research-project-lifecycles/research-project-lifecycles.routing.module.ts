import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RplIndexComponent } from '@app/modules/lms/pages/research-managers/research-project-lifecycles/rpl-index/rpl-index.component';
import { RplFormComponent } from '@app/modules/lms/pages/research-managers/research-project-lifecycles/rpl-form/rpl-form.component';


const routes: Routes = [
  {
    path: '',
    component: RplIndexComponent
  },
  {
    path: 'form',
    component: RplFormComponent,
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
export class ResearchProjectLifecyclesRoutingModule {
}


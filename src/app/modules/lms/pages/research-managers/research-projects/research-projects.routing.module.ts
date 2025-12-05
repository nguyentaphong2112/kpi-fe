import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RpsIndexComponent } from '@app/modules/lms/pages/research-managers/research-projects/rps-index/rps-index.component';
import { RpsFormComponent } from '@app/modules/lms/pages/research-managers/research-projects/rps-form/rps-form.component';


const routes: Routes = [
  {
    path: '',
    component: RpsIndexComponent
  },
  {
    path: 'form',
    component: RpsFormComponent,
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
export class ResearchProjectsRoutingModule {
}


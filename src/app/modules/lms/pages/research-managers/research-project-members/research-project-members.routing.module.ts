import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RpmIndexComponent } from '@app/modules/lms/pages/research-managers/research-project-members/rpm-index/rpm-index.component';
import { RpmFormComponent } from '@app/modules/lms/pages/research-managers/research-project-members/rpm-form/rpm-form.component';


const routes: Routes = [
  {
    path: '',
    component: RpmIndexComponent
  },
  {
    path: 'form',
    component: RpmFormComponent,
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
export class ResearchProjectMembersRoutingModule {
}


import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { IssIndexComponent } from '@app/modules/lms/pages/internship-managers/internship-sessions/iss-index/iss-index.component';
import { IssFormComponent } from '@app/modules/lms/pages/internship-managers/internship-sessions/iss-form/iss-form.component';


const routes: Routes = [
  {
    path: '',
    component: IssIndexComponent
  },
  {
    path: 'form',
    component: IssFormComponent,
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
export class InternshipSessionsRoutingModule {
}


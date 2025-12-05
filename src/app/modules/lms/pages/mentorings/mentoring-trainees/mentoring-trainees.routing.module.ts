import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MtsIndexComponent } from '@app/modules/lms/pages/mentorings/mentoring-trainees/mts-index/mts-index.component';
import { MtsFormComponent } from '@app/modules/lms/pages/mentorings/mentoring-trainees/mts-form/mts-form.component';


const routes: Routes = [
  {
    path: '',
    component: MtsIndexComponent
  },
  {
    path: 'form',
    component: MtsFormComponent,
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
export class MentoringTraineesRoutingModule {
}


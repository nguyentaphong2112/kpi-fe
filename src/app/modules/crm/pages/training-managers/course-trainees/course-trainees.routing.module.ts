import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CtsIndexComponent } from '@app/modules/crm/pages/training-managers/course-trainees/cts-index/cts-index.component';
import { CtsFormComponent } from '@app/modules/crm/pages/training-managers/course-trainees/cts-form/cts-form.component';


const routes: Routes = [
  {
    path: '',
    component: CtsIndexComponent
  },
  {
    path: 'form',
    component: CtsFormComponent,
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
export class CourseTraineesRoutingModule {
}


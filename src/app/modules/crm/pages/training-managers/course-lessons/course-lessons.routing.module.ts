import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClsIndexComponent } from '@app/modules/crm/pages/training-managers/course-lessons/cls-index/cls-index.component';
import { ClsFormComponent } from '@app/modules/crm/pages/training-managers/course-lessons/cls-form/cls-form.component';


const routes: Routes = [
  {
    path: '',
    component: ClsIndexComponent
  },
  {
    path: 'form',
    component: ClsFormComponent,
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
export class CourseLessonsRoutingModule {
}


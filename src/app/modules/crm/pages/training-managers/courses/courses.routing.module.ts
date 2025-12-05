import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CoursesIndexComponent } from '@app/modules/crm/pages/training-managers/courses/courses-index/courses-index.component';
import { CoursesFormComponent } from '@app/modules/crm/pages/training-managers/courses/courses-form/courses-form.component';


const routes: Routes = [
  {
    path: '',
    component: CoursesIndexComponent
  },
  {
    path: 'form',
    component: CoursesFormComponent,
    data: {
      isShowBackBtn: true,
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule {
}


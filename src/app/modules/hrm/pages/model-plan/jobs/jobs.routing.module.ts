import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { JobsIndexComponent } from '@app/modules/hrm/pages/model-plan/jobs/jobs-index/jobs-index.component';

const routes: Routes = [
  {
    path: '',
    component: JobsIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule {
}

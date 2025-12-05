import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'organization',
    loadChildren: () => import('../model-plan/organizations/organizations.module').then(m => m.OrganizationsModule)
  },
  {
    path: 'job',
    loadChildren: () => import('../model-plan/jobs/jobs.module').then(m => m.JobsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelPlanRoutingModule {
}

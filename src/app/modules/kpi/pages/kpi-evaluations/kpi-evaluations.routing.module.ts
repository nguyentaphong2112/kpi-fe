import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'employee-evaluations',
    loadChildren: () => import('../kpi-evaluations/employee-evaluations/employee-evaluations.module').then(m => m.EmployeeEvaluationsModule)
  },
  {
    path: 'organization-evaluations',
    loadChildren: () => import('../kpi-evaluations/organization-evaluations/organization-evaluations.module').then(m => m.OrganizationEvaluationsModule)
  },
  {
    path: 'personal-evaluations',
    loadChildren: () => import('../kpi-evaluations/personal-evaluations/personal-evaluations.module').then(m => m.PersonalEvaluationsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationsRoutingModule {
}

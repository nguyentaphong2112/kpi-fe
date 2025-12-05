import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'employee-evaluations',
    loadChildren: () => import('../kpi-provides/employee-evaluations/employee-evaluations.module').then(m => m.EmployeeEvaluationsModule)
  },
  {
    path: 'organization-evaluations',
    loadChildren: () => import('../kpi-provides/organization-evaluations/organization-evaluations.module').then(m => m.OrganizationEvaluationsModule)
  },
  {
    path: 'personal-evaluations',
    loadChildren: () => import('../kpi-provides/personal-evaluations/personal-evaluations.module').then(m => m.PersonalEvaluationsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiProvidesRoutingModule {
}

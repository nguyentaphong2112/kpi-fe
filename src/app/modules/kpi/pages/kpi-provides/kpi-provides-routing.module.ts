import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  OrganizationProvideLevel1Module
} from '@app/modules/kpi/pages/kpi-provides/organization-provide-level1/organization-provide-level1.module';

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
  },
  {
    path: 'organization-provide-level1',
    loadChildren: () => import('../kpi-provides/organization-provide-level1/organization-provide-level1.module').then(m => m.OrganizationProvideLevel1Module)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiProvidesRoutingModule {
}

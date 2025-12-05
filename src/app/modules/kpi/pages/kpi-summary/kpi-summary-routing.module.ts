import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'employee-summary',
    loadChildren: () => import('../kpi-summary/employee-summary/employee-summary.module').then(m => m.EmployeeSummaryModule)
  },
  {
    path: 'organization-summary',
    loadChildren: () => import('../kpi-summary/organization-summary/organization-summary.module').then(m => m.OrganizationSummaryModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiSummaryRoutingModule {
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportReportModule } from '@app/modules/kpi/pages/kpi-summary/export-report/export-report.module';

const routes: Routes = [
  {
    path: 'employee-summary',
    loadChildren: () => import('../kpi-summary/employee-summary/employee-summary.module').then(m => m.EmployeeSummaryModule)
  },
  {
    path: 'organization-summary',
    loadChildren: () => import('../kpi-summary/organization-summary/organization-summary.module').then(m => m.OrganizationSummaryModule)
  },
  {
    path: 'organization-aggregate-data',
    loadChildren: () => import('../kpi-summary/organization-aggregate-data/organization-aggregate-data.module').then(m => m.OrganizationAggregateDataModule)
  },
  {
    path: 'export',
    loadChildren: () => import('../kpi-summary/export-report/export-report.module').then(m => m.ExportReportModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiSummaryRoutingModule {
}

import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'insurance-contributions',
    loadChildren: () => import('../caculate/insurance-contributions/insurance-contributions.module').then(m => m.InsuranceContributionsModule)
  },
  {
    path: 'insurance-retractions',
    loadChildren: () => import('../caculate/insurance-retractions/insurance-retractions.module').then(m => m.InsuranceRetractionsModule)
  },
  {
    path: 'employee-changes',
    loadChildren: () => import('../caculate/employee-changes/employee-changes.module').then(m => m.EmployeeChangesModule)
  },
  {
    path: 'report',
    loadChildren: () => import('../caculate/report/report.module').then(m => m.ReportModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaculateRoutingModule { }

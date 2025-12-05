import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'kpi-managers',
    loadChildren: () => import('./pages/kpi-managers/kpi-managers.module').then(m => m.KpiManagersModule)
  },
  {
    path: 'kpi-evaluations',
    loadChildren: () => import('./pages/kpi-evaluations/kpi-evaluations.module').then(m => m.EvaluationsModule)
  },
  {
    path: 'kpi-provides',
    loadChildren: () => import('./pages/kpi-provides/kpi-provides.module').then(m => m.KpiProvidesModule)
  },
  {
    path: 'kpi-summary',
    loadChildren: () => import('./pages/kpi-summary/kpi-summary.module').then(m => m.KpiSummaryModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiRoutingModule {
}

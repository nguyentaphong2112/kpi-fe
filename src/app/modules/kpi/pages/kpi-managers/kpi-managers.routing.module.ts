import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'evaluation-periods',
    loadChildren: () => import('../kpi-managers/evaluation-periods/evaluation-periods.module').then(m => m.EvaluationPeriodsModule)
  },
  {
    path: 'indicator-conversions',
    loadChildren: () => import('../kpi-managers/indicator-conversions/indicator-conversions.module').then(m => m.IndicatorConversionsModule)
  },
  {
    path: 'indicators',
    loadChildren: () => import('../kpi-managers/indicators/indicators.module').then(m => m.IndicatorsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagersRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'hrm',
    loadChildren: () => import('./hrm/hrm.module').then((m) => m.HrmModule),
  },
  {
    path: 'kpi',
    loadChildren: () => import('./kpi/kpi.module').then((m) => m.KpiModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureRoutingModule {}

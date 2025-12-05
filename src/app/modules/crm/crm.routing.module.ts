import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'order-managers',
    loadChildren: () => import('./pages/order-managers/order-managers.module').then(m => m.OrderManagersModule)
  },
  {
    path: 'hrm-managers',
    loadChildren: () => import('./pages/hrm-managers/hrm-managers.module').then(m => m.HrmManagersModule)
  },
  {
    path: 'category-managers',
    loadChildren: () => import('./pages/category-managers/category-managers.module').then(m => m.CategoryManagersModule)
  },
  {
    path: 'pytago-managers',
    loadChildren: () => import('./pages/pytago-managers/pytago-managers.module').then(m => m.PytagoManagersModule)
  },
  {
    path: 'training-managers',
    loadChildren: () => import('./pages/training-managers/training-managers.module').then(m => m.TrainingManagersModule)
  },
  {
    path: 'cskh',
    loadChildren: () => import('./pages/cskh/cskh.module').then(m => m.CskhModule)
  },
  {
    path: 'export-report',
    loadChildren: () => import('./pages/export-report/export-report.module').then(m => m.ExportReportModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }

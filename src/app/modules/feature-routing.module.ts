import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LmsModule } from '@app/modules/lms/lms.module';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'library',
    loadChildren: () => import('./library/library.module').then((m) => m.LibraryModule),
  },
  {
    path: 'hrm',
    loadChildren: () => import('./hrm/hrm.module').then((m) => m.HrmModule),
  },
  {
    path: 'kpi',
    loadChildren: () => import('./kpi/kpi.module').then((m) => m.KpiModule),
  },
  {
    path: 'abs',
    loadChildren: () => import('./abs/abs.module').then((m) => m.AbsModule),
  },
  {
    path: 'crm',
    loadChildren: () => import('./crm/crm.module').then((m) => m.CrmModule),
  },
  {
    path: 'lms',
    loadChildren: () => import('./lms/lms.module').then((m) => m.LmsModule),
  },
  {
    path: 'lms',
    loadChildren: () => import('./lms/lms.module').then(m => m.LmsModule),
  },
  {
    path: 'mat',
    loadChildren: () => import('./mat/mat.module').then(m => m.MatModule),
  },
  {
    path: 'pit',
    loadChildren: () => import('./pit/pit.module').then(m => m.PitModule),
  },
  {
    path: 'icn',
    loadChildren: () => import('./icn/icn.module').then(m => m.IcnModule),
  },
  {
    path: 'ptx',
    loadChildren: () => import('./ptx/ptx.module').then(m => m.PtxModule),
  },
  {
    path: 'log-task',
    loadChildren: () =>
      import('./hrm/pages/log-task/log-task.module').then(m => m.LogTaskModule)
  },
  {
    path: 'exam',
    loadChildren: () => import('./exam/exam.module').then(m => m.ExamModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureRoutingModule {}

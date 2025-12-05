import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'internship-managers',
    loadChildren: () => import('./pages/internship-managers/internship-managers.module').then(m => m.InternshipManagersModule)
  },
  {
    path: 'training-managers',
    loadChildren: () => import('./pages/training-managers/training-managers.module').then(m => m.TrainingManagersModule)
  },
  {
    path: 'mentorings',
    loadChildren: () => import('./pages/mentorings/mentorings.module').then((m) => m.MentoringsModule)
  },
  {
    path: 'research-managers',
    loadChildren: () =>
      import('./pages/research-managers/research-managers.module').then((m) => m.ResearchManagersModule)
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
export class RoutingModule {
}

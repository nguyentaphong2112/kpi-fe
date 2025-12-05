import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'internship-sessions',
    loadChildren: () => import('../internship-managers/internship-sessions/internship-sessions.module').then(m => m.InternshipSessionsModule)
  },
  {
    path: 'internship-session-details',
    loadChildren: () => import('../internship-managers/internship-session-details/internship-session-details.module').then(m => m.InternshipSessionDetailsModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternshipManagersRoutingModule { }

import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'sessions',
    loadChildren: () => import('../sessions-manager/sessions/sessions.module').then(m => m.SessionsModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionsManagerRoutingModule { }

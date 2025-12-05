import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'question-manager',
    loadChildren: () => import('./pages/question-manager/question-manager.module').then(m => m.QuestionManagerModule)
  },
  {
    path: 'sessions-manager',
    loadChildren: () => import('./pages/sessions-manager/sessions-manager.module').then(m => m.SessionsManagerModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }

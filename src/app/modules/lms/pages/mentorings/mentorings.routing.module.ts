import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'mentoring-trainers',
    loadChildren: () => import('../mentorings/mentoring-trainers/mentoring-trainers.module').then(m => m.MentoringTrainersModule)
  },
  {
    path: 'mentoring-trainees',
    loadChildren: () => import('../mentorings/mentoring-trainees/mentoring-trainees.module').then(m => m.MentoringTraineesModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MentoringsRoutingModule { }

import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'course-trainees',
    loadChildren: () => import('../training-managers/course-trainees/course-trainees.module').then(m => m.CourseTraineesModule)
  },
  {
    path: 'course-lessons',
    loadChildren: () => import('../training-managers/course-lessons/course-lessons.module').then(m => m.CourseLessonsModule)
  },
  {
    path: 'courses',
    loadChildren: () => import('../training-managers/courses/courses.module').then(m => m.CoursesModule)
  },
  {
    path: 'training-programs',
    loadChildren: () => import('../training-managers/training-programs/training-programs.module').then(m => m.TrainingProgramsModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingManagersRoutingModule { }

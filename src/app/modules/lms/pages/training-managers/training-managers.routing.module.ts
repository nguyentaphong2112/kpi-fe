import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'training-process',
    loadChildren: () => import('../training-managers/training-process/training-process.module').then(m => m.TrainingProcessModule)
  },
  {
    path: 'external-trainings',
    loadChildren: () => import('../training-managers/external-trainings/external-trainings.module').then(m => m.ExternalTrainingsModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingManagersRoutingModule { }

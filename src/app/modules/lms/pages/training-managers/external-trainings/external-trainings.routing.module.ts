import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  EtsIndexComponent
} from '@app/modules/lms/pages/training-managers/external-trainings/ets-index/ets-index.component';


const routes: Routes = [
  {
    path: '',
    component: EtsIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalTrainingsRoutingModule {
}


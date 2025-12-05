import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TpsIndexComponent } from '@app/modules/lms/pages/training-managers/training-process/tps-index/tps-index.component';
import { TpsFormComponent } from '@app/modules/lms/pages/training-managers/training-process/tps-form/tps-form.component';


const routes: Routes = [
  {
    path: '',
    component: TpsIndexComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingProcessRoutingModule {
}


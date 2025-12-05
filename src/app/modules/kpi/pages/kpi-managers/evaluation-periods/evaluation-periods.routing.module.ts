import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  EpsIndexComponent
} from '@app/modules/kpi/pages/kpi-managers/evaluation-periods/eps-index/eps-index.component';


const routes: Routes = [
  {
    path: '',
    component: EpsIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationPeriodsRoutingModule {
}


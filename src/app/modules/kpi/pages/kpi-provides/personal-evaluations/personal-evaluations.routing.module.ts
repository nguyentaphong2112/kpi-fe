import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  PesIndexComponent
} from '@app/modules/kpi/pages/kpi-provides/personal-evaluations/pes-index/pes-index.component';
import {
  PesFormComponent
} from '@app/modules/kpi/pages/kpi-provides/personal-evaluations/pes-form/pes-form.component';


const routes: Routes = [
  {
    path: '',
    component: PesIndexComponent
  },
  {
    path: 'form',
    component: PesFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalEvaluationsRoutingModule {
}


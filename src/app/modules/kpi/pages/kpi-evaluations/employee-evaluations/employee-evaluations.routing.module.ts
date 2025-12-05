import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  EesIndexComponent
} from '@app/modules/kpi/pages/kpi-evaluations/employee-evaluations/ees-index/ees-index.component';
import {
  EesFormComponent
} from '@app/modules/kpi/pages/kpi-evaluations/employee-evaluations/ees-form/ees-form.component';
import {
  ListEvaluationComponent
} from '@app/modules/kpi/pages/kpi-evaluations/employee-evaluations/list-evaluation/list-evaluation.component';


const routes: Routes = [
  {
    path: '',
    component: EesIndexComponent
  },
  {
    path: 'form',
    component: EesFormComponent
  },
  {
    path: 'list-evaluation',
    component: ListEvaluationComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeEvaluationsRoutingModule {
}


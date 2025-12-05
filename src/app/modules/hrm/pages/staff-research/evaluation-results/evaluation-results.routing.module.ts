import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErsIndexComponent } from '@app/modules/hrm/pages/staff-research/evaluation-results/ers-index/ers-index.component';

const routes: Routes = [
  {
    path: '',
    component: ErsIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.evaluationResultInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationResultsRoutingModule { }

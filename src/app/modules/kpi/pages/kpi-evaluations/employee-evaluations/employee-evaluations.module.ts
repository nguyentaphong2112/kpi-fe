import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import {
  EesIndexComponent
} from '@app/modules/kpi/pages/kpi-evaluations/employee-evaluations/ees-index/ees-index.component';
import {
  EesFormComponent
} from '@app/modules/kpi/pages/kpi-evaluations/employee-evaluations/ees-form/ees-form.component';
import {
  EmployeeEvaluationsRoutingModule
} from '@app/modules/kpi/pages/kpi-evaluations/employee-evaluations/employee-evaluations.routing.module';
import {
  EvaluationCriteriaComponent
} from '@app/modules/kpi/pages/kpi-evaluations/employee-evaluations/evaluation-criteria/evaluation-criteria.component';
import {
  IndicatorPopupComponent
} from '@app/modules/kpi/pages/kpi-evaluations/employee-evaluations/indicator-popup/indicator-popup.component';
import {
  ListEvaluationComponent
} from '@app/modules/kpi/pages/kpi-evaluations/employee-evaluations/list-evaluation/list-evaluation.component';

export function declaration() {
  return [EesIndexComponent, EesFormComponent, EvaluationCriteriaComponent, IndicatorPopupComponent, ListEvaluationComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, EmployeeEvaluationsRoutingModule]
})
export class EmployeeEvaluationsModule {
}


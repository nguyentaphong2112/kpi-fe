import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import {
  PesIndexComponent
} from '@app/modules/kpi/pages/kpi-provides/personal-evaluations/pes-index/pes-index.component';
import {
  PesFormComponent
} from '@app/modules/kpi/pages/kpi-provides/personal-evaluations/pes-form/pes-form.component';
import {
  EvaluationCriteriaComponent
} from '@app/modules/kpi/pages/kpi-provides/personal-evaluations/evaluation-criteria/evaluation-criteria.component';
import {
  WorkPlanComponent
} from '@app/modules/kpi/pages/kpi-provides/personal-evaluations/work-plan/work-plan.component';
import {
  PersonalEvaluationsRoutingModule
} from '@app/modules/kpi/pages/kpi-provides/personal-evaluations/personal-evaluations.routing.module';

export function declaration() {
  return [PesIndexComponent, PesFormComponent, EvaluationCriteriaComponent, WorkPlanComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, PersonalEvaluationsRoutingModule]
})
export class PersonalEvaluationsModule {
}


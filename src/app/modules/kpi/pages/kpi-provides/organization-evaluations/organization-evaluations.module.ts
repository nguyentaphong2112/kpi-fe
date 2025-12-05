import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import {
  OesIndexComponent
} from '@app/modules/kpi/pages/kpi-provides/organization-evaluations/oes-index/oes-index.component';
import {
  OesFormComponent
} from '@app/modules/kpi/pages/kpi-provides/organization-evaluations/oes-form/oes-form.component';
import {
  OrganizationEvaluationsRoutingModule
} from '@app/modules/kpi/pages/kpi-provides/organization-evaluations/organization-evaluations.routing.module';
import {
  EvaluationCriteriaComponent
} from '@app/modules/kpi/pages/kpi-provides/organization-evaluations/evaluation-criteria/evaluation-criteria.component';
export function declaration() {
  return [OesIndexComponent, OesFormComponent, EvaluationCriteriaComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, OrganizationEvaluationsRoutingModule]
})
export class OrganizationEvaluationsModule {
}


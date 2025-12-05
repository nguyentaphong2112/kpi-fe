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
import {
  WorkPlanComponent
} from '@app/modules/kpi/pages/kpi-provides/organization-evaluations/work-plan/work-plan.component';
import {
  AssignmentModalComponent
} from '@app/modules/kpi/pages/kpi-provides/organization-evaluations/assignment-modal/assignment-modal.component';
import {
  ViewOrgParentComponent
} from '@app/modules/kpi/pages/kpi-provides/organization-evaluations/view-org-parent/view-org-parent.component';

export function declaration() {
  return [OesIndexComponent, OesFormComponent, EvaluationCriteriaComponent, WorkPlanComponent, AssignmentModalComponent, ViewOrgParentComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, OrganizationEvaluationsRoutingModule]
})
export class OrganizationEvaluationsModule {
}


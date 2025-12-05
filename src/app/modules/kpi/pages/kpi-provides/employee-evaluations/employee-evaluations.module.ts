import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import {
  EesIndexComponent
} from '@app/modules/kpi/pages/kpi-provides/employee-evaluations/ees-index/ees-index.component';
import { EesFormComponent } from '@app/modules/kpi/pages/kpi-provides/employee-evaluations/ees-form/ees-form.component';
import {
  EmployeeEvaluationsRoutingModule
} from '@app/modules/kpi/pages/kpi-provides/employee-evaluations/employee-evaluations.routing.module';
import {
  EvaluationCriteriaComponent
} from '@app/modules/kpi/pages/kpi-provides/employee-evaluations/evaluation-criteria/evaluation-criteria.component';
import {
  IndicatorPopupComponent
} from '@app/modules/kpi/pages/kpi-provides/employee-evaluations/indicator-popup/indicator-popup.component';
import {
  OrganizationEvaluationsModule
} from '@app/modules/kpi/pages/kpi-provides/organization-evaluations/organization-evaluations.module';
import {
  ViewIndicatorComponent
} from '@app/modules/kpi/pages/kpi-provides/employee-evaluations/view-indicator/view-indicator.component';

export function declaration() {
  return [EesIndexComponent, EesFormComponent, EvaluationCriteriaComponent, IndicatorPopupComponent, ViewIndicatorComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, EmployeeEvaluationsRoutingModule, OrganizationEvaluationsModule]
})
export class EmployeeEvaluationsModule {
}


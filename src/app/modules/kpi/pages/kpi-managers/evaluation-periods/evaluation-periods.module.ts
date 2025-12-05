import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {EpsIndexComponent} from "@app/modules/kpi/pages/kpi-managers/evaluation-periods/eps-index/eps-index.component";
import {EpsFormComponent} from "@app/modules/kpi/pages/kpi-managers/evaluation-periods/eps-form/eps-form.component";
import {EvaluationPeriodsRoutingModule} from "@app/modules/kpi/pages/kpi-managers/evaluation-periods/evaluation-periods.routing.module";

export function declaration() {
  return [EpsIndexComponent, EpsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, EvaluationPeriodsRoutingModule]
})
export class EvaluationPeriodsModule { }


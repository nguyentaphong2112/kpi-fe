import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {WptIndexComponent} from "@app/modules/kpi/pages/kpi-templates/work-planning-templates/wpt-index/wpt-index.component";
import {WptFormComponent} from "@app/modules/kpi/pages/kpi-templates/work-planning-templates/wpt-form/wpt-form.component";
import {WorkPlanningTemplatesRoutingModule} from "@app/modules/kpi/pages/kpi-templates/work-planning-templates/work-planning-templates.routing.module";

export function declaration() {
  return [WptIndexComponent, WptFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, WorkPlanningTemplatesRoutingModule]
})
export class WorkPlanningTemplatesModule { }


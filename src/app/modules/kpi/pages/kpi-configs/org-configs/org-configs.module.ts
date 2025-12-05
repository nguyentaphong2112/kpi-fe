import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {OcsIndexComponent} from "@app/modules/kpi/pages/kpi-configs/org-configs/ocs-index/ocs-index.component";
import {OcsFormComponent} from "@app/modules/kpi/pages/kpi-configs/org-configs/ocs-form/ocs-form.component";
import {OrgConfigsRoutingModule} from "@app/modules/kpi/pages/kpi-configs/org-configs/org-configs.routing.module";

export function declaration() {
  return [OcsIndexComponent, OcsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, OrgConfigsRoutingModule]
})
export class OrgConfigsModule { }


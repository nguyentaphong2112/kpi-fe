import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {DssIndexComponent} from "@app/modules/abs/pages/duty-schedule-manager/duty-schedules/dss-index/dss-index.component";
import {DssFormComponent} from "@app/modules/abs/pages/duty-schedule-manager/duty-schedules/dss-form/dss-form.component";
import {DutySchedulesRoutingModule} from "@app/modules/abs/pages/duty-schedule-manager/duty-schedules/duty-schedules.routing.module";

export function declaration() {
  return [DssIndexComponent, DssFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, DutySchedulesRoutingModule]
})
export class DutySchedulesModule { }


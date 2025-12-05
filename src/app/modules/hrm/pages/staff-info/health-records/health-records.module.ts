import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {sIndexComponent} from "@app/modules/hrm/pages/staff-info/health-records/hrs-index/hrs-index.component";
import {sFormComponent} from "@app/modules/hrm/pages/staff-info/health-records/hrs-form/hrs-form.component";
import {HealthRecordsRoutingModule} from "@app/modules/hrm/pages/staff-info/health-records/health-records.routing.module";

export function declaration() {
  return [sIndexComponent, sFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, HealthRecordsRoutingModule]
})
export class HealthRecordsModule { }


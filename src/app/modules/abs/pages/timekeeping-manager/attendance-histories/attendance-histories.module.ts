import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {AhsIndexComponent} from "@app/modules/abs/pages/timekeeping-manager/attendance-histories/ahs-index/ahs-index.component";
import {AhsFormComponent} from "@app/modules/abs/pages/timekeeping-manager/attendance-histories/ahs-form/ahs-form.component";
import {AttendanceHistoriesRoutingModule} from "@app/modules/abs/pages/timekeeping-manager/attendance-histories/attendance-histories.routing.module";

export function declaration() {
  return [AhsIndexComponent, AhsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, AttendanceHistoriesRoutingModule]
})
export class AttendanceHistoriesModule { }


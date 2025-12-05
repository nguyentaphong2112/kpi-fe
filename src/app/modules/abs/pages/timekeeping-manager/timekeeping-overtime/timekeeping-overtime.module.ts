import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {TkgIndexComponent} from "@app/modules/abs/pages/timekeeping-manager/timekeepings/tkg-index/tkg-index.component";
import {TkgFormComponent} from "@app/modules/abs/pages/timekeeping-manager/timekeepings/tkg-form/tkg-form.component";
import {TimekeepingsRoutingModule} from "@app/modules/abs/pages/timekeeping-manager/timekeepings/timekeepings.routing.module";
import {
  ToeIndexComponent
} from "@app/modules/abs/pages/timekeeping-manager/timekeeping-overtime/toe-index/toe-index.component";
import {
  ToeFormComponent
} from "@app/modules/abs/pages/timekeeping-manager/timekeeping-overtime/toe-form/toe-form.component";
import {
  TimekeepingOvertimeRoutingModule
} from "@app/modules/abs/pages/timekeeping-manager/timekeeping-overtime/timekeeping-overtime.routing.module";

export function declaration() {
  return [ToeIndexComponent, ToeFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, TimekeepingOvertimeRoutingModule]
})
export class TimekeepingOvertimeModule { }


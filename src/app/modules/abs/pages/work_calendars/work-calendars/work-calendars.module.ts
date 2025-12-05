import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {WcsIndexComponent} from "@app/modules/abs/pages/work_calendars/work-calendars/wcs-index/wcs-index.component";
import {WcsFormComponent} from "@app/modules/abs/pages/work_calendars/work-calendars/wcs-form/wcs-form.component";
import {WorkCalendarsRoutingModule} from "@app/modules/abs/pages/work_calendars/work-calendars/work-calendars.routing.module";

export function declaration() {
  return [WcsIndexComponent, WcsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, WorkCalendarsRoutingModule]
})
export class WorkCalendarsModule { }


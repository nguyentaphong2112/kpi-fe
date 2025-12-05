import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {WcdIndexComponent} from "@app/modules/abs/pages/work_calendars/work-calendar-details/wcd-index/wcd-index.component";
import {WcdFormComponent} from "@app/modules/abs/pages/work_calendars/work-calendar-details/wcd-form/wcd-form.component";
import {WorkCalendarDetailsRoutingModule} from "@app/modules/abs/pages/work_calendars/work-calendar-details/work-calendar-details.routing.module";
import {NgOptimizedImage} from "@angular/common";

export function declaration() {
  return [WcdIndexComponent, WcdFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
    imports: [SharedModule, WorkCalendarDetailsRoutingModule, NgOptimizedImage]
})
export class WorkCalendarDetailsModule { }


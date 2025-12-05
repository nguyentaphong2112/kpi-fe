import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import {CalendarComponent} from "@app/modules/abs/pages/category-manager/work-calendars/ui/calendar/calendar.component";
import {
  WorkCalendarsRoutingModule
} from "@app/modules/abs/pages/category-manager/work-calendars/work-calendars.routing.module";
import {WcsFormComponent} from "@app/modules/abs/pages/category-manager/work-calendars/wcs-form/wcs-form.component";
import {
  WcsIndexComponent
} from "@app/modules/abs/pages/category-manager/work-calendars/wcs-index/wcs-index.component";
import {
  CalendarImportComponent
} from "@app/modules/abs/pages/category-manager/work-calendars/ui/calendar-import/calendar-import.component";

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarImportComponent,
    WcsIndexComponent,
    WcsFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WorkCalendarsRoutingModule,
  ]
})
export class WorkCalendarsModule { }

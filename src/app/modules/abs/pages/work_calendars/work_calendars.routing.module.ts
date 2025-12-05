import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'work-calendar-details',
    loadChildren: () => import('../work_calendars/work-calendar-details/work-calendar-details.module').then(m => m.WorkCalendarDetailsModule)
  },
  {
    path: 'work-calendars',
    loadChildren: () => import('../work_calendars/work-calendars/work-calendars.module').then(m => m.WorkCalendarsModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Work_calendarsRoutingModule { }

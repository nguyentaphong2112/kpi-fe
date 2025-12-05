import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'categories',
    loadChildren: () => import('@app/modules/abs/pages/category-manager/category-manager.module').then(m => m.CategoryManagerModule)
  },
  {
    path: 'work-calendars',
    loadChildren: () => import('./pages/work_calendars/work_calendars.module').then(m => m.Work_calendarsModule)
  },
  {
    path: 'timekeeping-manager',
    loadChildren: () => import('./pages/timekeeping-manager/timekeeping-manager.module').then(m => m.TimekeepingManagerModule)
  },
  {
    path: 'request-manager',
    loadChildren: () => import('./pages/request-manager/request-manager.module').then(m => m.RequestManagerModule)
  },
   {
    path: 'duty-schedule-manager',
    loadChildren: () => import('./pages/duty-schedule-manager/duty-schedule-manager.module').then(m => m.DutyScheduleManagerModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbsRoutingModule { }

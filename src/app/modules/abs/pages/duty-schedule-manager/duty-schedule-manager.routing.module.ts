import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  DutyScheduleMonthModule
} from '@app/modules/abs/pages/duty-schedule-manager/duty-schedule-month/duty-schedule-month.module';

const routes: Routes = [
  {
    path: 'duty-schedules',
    loadChildren: () => import('../duty-schedule-manager/duty-schedules/duty-schedules.module').then(m => m.DutySchedulesModule)
  },
  {
    path: 'duty-schedule-month',
    loadChildren: () => import('../duty-schedule-manager/duty-schedule-month/duty-schedule-month.module').then(m => m.DutyScheduleMonthModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutyScheduleManagerRoutingModule {
}

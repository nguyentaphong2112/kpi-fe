import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  DssIndexComponent
} from '@app/modules/abs/pages/duty-schedule-manager/duty-schedules/dss-index/dss-index.component';
import {
  DssFormComponent
} from '@app/modules/abs/pages/duty-schedule-manager/duty-schedules/dss-form/dss-form.component';
import {
  DsmIndexComponent
} from '@app/modules/abs/pages/duty-schedule-manager/duty-schedule-month/dsm-index/dsm-index.component';
import {
  DsmFormComponent
} from '@app/modules/abs/pages/duty-schedule-manager/duty-schedule-month/dsm-form/dsm-form.component';

const routes: Routes = [
  {
    path: '',
    component: DsmIndexComponent
  },
  {
    path: 'form',
    component: DsmFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutyScheduleMonthRoutingModule {
}

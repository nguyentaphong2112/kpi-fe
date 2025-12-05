import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DssIndexComponent } from '@app/modules/abs/pages/duty-schedule-manager/duty-schedules/dss-index/dss-index.component';
import { DssFormComponent } from '@app/modules/abs/pages/duty-schedule-manager/duty-schedules/dss-form/dss-form.component';


const routes: Routes = [
  {
    path: '',
    component: DssIndexComponent
  },
  {
    path: 'form',
    component: DssFormComponent,
    data: {
      isShowBackBtn: true,
      pageName: 'Thêm mới',
      breadcrumb: 'Thêm mới'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutySchedulesRoutingModule {
}


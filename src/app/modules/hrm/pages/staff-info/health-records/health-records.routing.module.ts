import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { sIndexComponent } from '@app/modules/hrm/pages/staff-info/health-records/hrs-index/hrs-index.component';
import { sFormComponent } from '@app/modules/hrm/pages/staff-info/health-records/hrs-form/hrs-form.component';


const routes: Routes = [
  {
    path: '',
    component: sIndexComponent
  },
  {
    path: 'form',
    component: sFormComponent,
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
export class HealthRecordsRoutingModule {
}


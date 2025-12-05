import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AhsIndexComponent } from '@app/modules/abs/pages/timekeeping-manager/attendance-histories/ahs-index/ahs-index.component';
import { AhsFormComponent } from '@app/modules/abs/pages/timekeeping-manager/attendance-histories/ahs-form/ahs-form.component';


const routes: Routes = [
  {
    path: '',
    component: AhsIndexComponent
  },
  {
    path: 'form',
    component: AhsFormComponent,
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
export class AttendanceHistoriesRoutingModule {
}


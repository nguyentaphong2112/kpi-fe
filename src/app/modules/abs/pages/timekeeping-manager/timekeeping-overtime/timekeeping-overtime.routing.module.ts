import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  ToeIndexComponent
} from "@app/modules/abs/pages/timekeeping-manager/timekeeping-overtime/toe-index/toe-index.component";
import {
  ToeFormComponent
} from "@app/modules/abs/pages/timekeeping-manager/timekeeping-overtime/toe-form/toe-form.component";


const routes: Routes = [
  {
    path: '',
    component: ToeIndexComponent
  },
  {
    path: 'form',
    component: ToeFormComponent,
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
export class TimekeepingOvertimeRoutingModule {
}


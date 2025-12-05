import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  OrsIndexComponent
} from "@app/modules/abs/pages/timekeeping-manager/overtime-records/ors-index/ors-index.component";
import {
  TalIndexComponent
} from "@app/modules/abs/pages/timekeeping-manager/timekeeping-approval/tal-index/tal-index.component";

const routes: Routes = [
  {
    path: '',
    component:TalIndexComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimekeepingApprovalRoutingModule { }

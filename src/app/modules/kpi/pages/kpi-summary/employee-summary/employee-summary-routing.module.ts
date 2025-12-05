import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EsyIndexComponent} from "@app/modules/kpi/pages/kpi-summary/employee-summary/esy-index/esy-index.component";

const routes: Routes = [
  {
    path: '',
    component: EsyIndexComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeSummaryRoutingModule { }

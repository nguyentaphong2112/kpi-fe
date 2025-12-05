import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EesIndexComponent } from '@app/modules/kpi/pages/kpi-provides/employee-evaluations/ees-index/ees-index.component';
import { EesFormComponent } from '@app/modules/kpi/pages/kpi-provides/employee-evaluations/ees-form/ees-form.component';


const routes: Routes = [
  {
    path: '',
    component: EesIndexComponent
  },
  {
    path: 'form',
    component: EesFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeEvaluationsRoutingModule {
}


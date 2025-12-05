import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { OesIndexComponent } from '@app/modules/kpi/pages/kpi-evaluations/organization-evaluations/oes-index/oes-index.component';
import { OesFormComponent } from '@app/modules/kpi/pages/kpi-evaluations/organization-evaluations/oes-form/oes-form.component';


const routes: Routes = [
  {
    path: '',
    component: OesIndexComponent
  },
  {
    path: 'form',
    component: OesFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationEvaluationsRoutingModule {
}


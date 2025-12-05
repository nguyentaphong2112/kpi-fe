import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OadIndexComponent } from './oad-index/oad-index.component';
const routes: Routes = [
  {
    path: '',
    component: OadIndexComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationAggregateDataRoutingModule { }

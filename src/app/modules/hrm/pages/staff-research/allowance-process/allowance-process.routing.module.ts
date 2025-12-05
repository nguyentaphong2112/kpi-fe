import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApsIndexComponent } from './aps-index/aps-index.component';

const routes: Routes = [
  {
    path: '',
    component: ApsIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.allowanceProcessInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllowanceProcessRoutingModule { }

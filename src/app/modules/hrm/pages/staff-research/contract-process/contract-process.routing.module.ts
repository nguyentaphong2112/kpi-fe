import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CpsIndexComponent } from '@app/modules/hrm/pages/staff-research/contract-process/cps-index/cps-index.component';

const routes: Routes = [
  {
    path: '',
    component: CpsIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.contractProcessInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractProcessRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatIndexComponent } from '@app/modules/hrm/pages/staff-research/bank-account/bat-index/bat-index.component';

const routes: Routes = [
  {
    path: '',
    component: BatIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.bankAccountInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankAccountRoutingModule { }

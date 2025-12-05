import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WhyIndexComponent } from '@app/modules/hrm/pages/staff-research/worked-history/why-index/why-index.component';

const routes: Routes = [
  {
    path: '',
    component: WhyIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.workedHistoryInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkedHistoryRoutingModule { }

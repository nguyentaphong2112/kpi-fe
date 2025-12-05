import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PspIndexComponent } from '@app/modules/hrm/pages/staff-research/position-salary-process/psp-index/psp-index.component';

const routes: Routes = [
  {
    path: '',
    component: PspIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.positionSalaryProcessInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositionSalaryProcessRoutingModule { }

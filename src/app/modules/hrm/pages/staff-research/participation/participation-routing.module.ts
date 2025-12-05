import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PonIndexComponent } from '@app/modules/hrm/pages/staff-research/participation/pon-index/pon-index.component';

const routes: Routes = [
  {
    path: '',
    component: PonIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.participation'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParticipationRoutingModule { }

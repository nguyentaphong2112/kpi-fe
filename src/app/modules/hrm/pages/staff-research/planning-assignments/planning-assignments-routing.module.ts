import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PonIndexComponent } from '@app/modules/hrm/pages/staff-research/participation/pon-index/pon-index.component';
import {
  PasIndexComponent
} from '@app/modules/hrm/pages/staff-research/planning-assignments/pas-index/pas-index.component';

const routes: Routes = [{
  path: '',
  component: PasIndexComponent,
  data: {
    pageName: 'hrm.staffManager.staffResearch.pageName.planningAssignmentInfo'
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningAssignmentsRoutingModule {
}

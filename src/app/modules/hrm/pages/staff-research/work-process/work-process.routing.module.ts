import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WpsIndexComponent } from '@app/modules/hrm/pages/staff-research/work-process/wps-index/wps-index.component';

const routes: Routes = [
  {
    path: '',
    component: WpsIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.workProcessInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkProcessRoutingModule { }

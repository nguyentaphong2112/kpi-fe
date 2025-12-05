import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EpnIndexComponent } from '@app/modules/hrm/pages/staff-research/education-promotion/epn-index/epn-index.component';

const routes: Routes = [
  {
    path: '',
    component: EpnIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.educationPromotionInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EducationPromotionRoutingModule { }

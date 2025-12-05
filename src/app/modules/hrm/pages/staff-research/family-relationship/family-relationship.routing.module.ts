import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrpIndexComponent } from '@app/modules/hrm/pages/staff-research/family-relationship/frp-index/frp-index.component';

const routes: Routes = [
  {
    path: '',
    component: FrpIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.familyRelationshipInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FamilyRelationshipRoutingModule { }

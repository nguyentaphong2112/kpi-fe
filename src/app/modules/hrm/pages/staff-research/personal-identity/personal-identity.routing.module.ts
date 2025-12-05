import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PiyIndexComponent } from '@app/modules/hrm/pages/staff-research/personal-identity/piy-index/piy-index.component';

const routes: Routes = [
  {
    path: '',
    component: PiyIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.identityInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalIdentityRoutingModule { }
